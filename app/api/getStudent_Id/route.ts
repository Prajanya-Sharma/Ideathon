import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectDb";
import { getServerSession, User } from "next-auth";
import mongoose from "mongoose";
import { StudentModel } from "@/model/User";
import { authOptions } from "../(auth)/auth/[...nextauth]/options";
export async function GET(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    // Fetch the student record based on userId
    const student = await StudentModel.findOne({ user_id: userId }).select('student_id');

    if (!student) {
      return new Response(
        JSON.stringify({ success: false, message: 'Student not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, student_id: student.student_id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Server error', error: error }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
