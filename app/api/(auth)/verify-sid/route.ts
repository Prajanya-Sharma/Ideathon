import { NextRequest, NextResponse } from "next/server";
import  extractTextFromImageLinks, { extractDetails } from "../../../../lib/sidVerification";
import { StudentModel, UserModel } from "../../../../model/User";
import dbConnect from "../../../../lib/connectDb";


const extractNameFromEmail = (email: string | undefined): string | null => {
  if (!email || typeof email !== 'string') {
    return null;
  }

  const match = email.match(/^([a-zA-Z]+)\.bt\d+([a-z]+)@pec\.edu\.in$/);
  return match ? match[1] : null;
};

export async function POST(request: NextRequest) {
  console.log("inside api");

  await dbConnect();

  try {
    const { username, image } = await request.json();

    if (!username || !image) {
      return NextResponse.json(
        { success: false, message: 'Missing username or image in request body' },
        { status: 400 }
      );
    }
    console.log(username);
    const user = await UserModel.findOne({ username: username });
    const student = await StudentModel.findOne({ name: username });

    if (!student) {
      console.log("student here");
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user) {
      user.sid_verification = true;
      await user.save();
    } else {
      console.log("user here");
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const sidVerification = student.sid_verification;
    if (!sidVerification) {
      const imageLinks = [image];
      const results = await extractTextFromImageLinks(imageLinks);

      if (results[image]) {
        const { name, department, identityNo } = extractDetails(results[image]);

        console.log(department);
        console.log(name);

        const emailName = extractNameFromEmail(student.email as string);

        console.log(`emailName ${emailName}`);
        console.log(name?.toLowerCase().trim().replace(/\s+/g, ''));
        

        if (emailName && emailName.toLowerCase() === name?.toLowerCase().trim().replace(/\s+/g, '')) {
          student.name = name;
          student.sid_verification = true;
          student.branch = department as string;
          student.student_id = identityNo as string;
          await student.save();

          return NextResponse.json({
            success: true,
            message: 'SID verification completed',
            data: { name: name, department, identityNo },
          });
        } else {
          console.log('else ');
          user.sid_verification = false;
          await user.save();

          return NextResponse.json(
            { success: false, message: 'Name mismatch between email and extracted text' },
            { status: 400 }
          );
        }
      } else {
        user.sid_verification = false;
        await user.save();
        return NextResponse.json(
          { success: false, message: 'Failed to extract text from image' },
          { status: 500 }
        );
      }
    } else {
      
      return NextResponse.json(
        { success: false, message: 'SID verification already completed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return NextResponse.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}