//get all subjects of a students

import dbConnect from "../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {StudentModel} from "../../../../model/User";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const student = await StudentModel.findOne({user_id: userId});

    if (!student) {
      return NextResponse.json(
        {error: "student not found"},
        {status: 404}
      )
    }

    return NextResponse.json(student.enrolledSubjectId, {status: 200});
  } catch (error) {
    console.error('Error fetching event:', error);
    return new Response(
      JSON.stringify({success: false, message: 'Server error', error: error}),
      {status: 500, headers: {'Content-Type': 'application/json'}}
    );
  }
}
