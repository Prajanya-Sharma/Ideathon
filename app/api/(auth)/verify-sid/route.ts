import { NextRequest, NextResponse } from "next/server";
import extractTextFromImageLinks, { extractDetails } from "../../../../lib/sidVerification";
import { StudentModel, UserModel } from "../../../../model/User";
import dbConnect from "../../../../lib/connectDb";
import Groq from 'groq-sdk';

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const extractNameFromEmail = (email: string | undefined): string | null => {
  if (!email || typeof email !== 'string') {
    return null;
  }

  const match = email.match(/^([a-zA-Z]+)\.bt\d+([a-z]+)@pec\.edu\.in$/);
  return match ? match[1] : null;
};

const correctNamefromEmail = async (email: string | undefined): Promise<string | null> => {
  const prompt = `I am going to give you an email, from that email you have to return me the name of the person. The email is in the format: name.btxxxxx@pec.edu.in. So for example for an email antrikshgupta.bt23cseds@pec.edu.in, you have the return me the name as Antriksh Gupta. and send no other text, just the name in correct format, ${email}`
  const completion = await groqClient.chat.completions.create({
    messages: [{role:"user",content: prompt}],
    model: 'llama3-70b-8192'
  });
  return completion.choices[0]?.message?.content;
}

const aiNameChecker = async (emailName: string, name: string): Promise<boolean> => {
  const prompt = `I am going to give you two string, you have to tell me if they are same or not. \n\nString 1: ${emailName} \nString 2: ${name} \n\nAre these strings same? They dont have to be exactly equal. String like antriikshguppta and Antriksh Gupta are considered Same. One of the strings is coming from an OCR, so its expected to have some mistakes in reading. Your work is to overlook these mistakes and tell me by your thinking whether they are same names or not.\n\nPlease type yes or no and dont type any other text. just yes or no.`;

  const completion = await groqClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama3-8b-8192',
  });

  return completion.choices[0]?.message?.content === 'yes';
}

export async function POST(request: NextRequest) {
  console.log("Processing SID verification request");
  await dbConnect();

  try {
    const { username, image } = await request.json();

    if (!username || typeof username !== 'string' || !image || typeof image !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid username or image data' },
        { status: 400 }
      );
    }

    const [user, student] = await Promise.all([
      UserModel.findOne({ username: username }),
      StudentModel.findOne({ name: username })
    ]);

    if (!student || !user) {
      console.log("User or student record not found:", { user: !!user, student: !!student });
      return NextResponse.json(
        { success: false, message: 'User or student record not found' },
        { status: 404 }
      );
    }

    if (student.sid_verification) {
      console.log(`SID verification already completed for student: ${username}`);
      return NextResponse.json(
        { success: false, message: 'SID verification already completed' },
        { status: 400 }
      );
    }

    const imageLinks = [image];
    const results = await extractTextFromImageLinks(imageLinks);
    
    if (!results[image]) {
      user.sid_verification = false;
      await user.save();
      return NextResponse.json(
        { success: false, message: 'Failed to extract text from image' },
        { status: 500 }
      );
    }

    const { name, department, identityNo } = await extractDetails(results[image]);
    
    if (!name || !identityNo) {
      console.log("Failed to extract required details:", { name, identityNo });
      user.sid_verification = false;
      await user.save();
      return NextResponse.json(
        { success: false, message: 'Failed to extract required details from image' },
        { status: 400 }
      );
    }

    const emailName = extractNameFromEmail(student.email as string);
    if (!emailName) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    try {
      const namesMatch = await aiNameChecker(emailName, name);
      if (!namesMatch) {
        user.sid_verification = false;
        await user.save();
        console.log("Name mismatch between email and extracted text:", { emailName, name });
        return NextResponse.json(
          { success: false, message: 'Name mismatch between email and extracted text' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error in name verification:', error);
      return NextResponse.json(
        { success: false, message: 'Error during name verification' },
        { status: 500 }
      );
    }

    try {
      const correctedName = await correctNamefromEmail(student.email);
      student.name = correctedName ?? name;
      student.sid_verification = true;
      if (department) student.branch = department; // Only update branch if department was extracted
      student.student_id = identityNo;
      user.sid_verification = true;

      await Promise.all([
        student.save(),
        user.save()
      ]);

      return NextResponse.json({
        success: true,
        message: 'SID verification completed',
        data: { name, department, identityNo },
      });
    } catch (error) {
      console.error('Error saving updates:', error);
      return NextResponse.json(
        { success: false, message: 'Error saving verification data' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error verifying user:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during verification Try with a new and more clear image.' },
      { status: 500 }
    );
  }
}