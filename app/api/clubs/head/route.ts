import dbConnect from "../../../../lib/connectDb";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { StudentModel, ClubModel } from "../../../../model/User";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: "Unauthorized. User must be logged in." }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const student = await StudentModel.findOne({ user_id: userId }, { clubsHeadOf: 1 });

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    if (!student.clubsHeadOf || student.clubsHeadOf.length === 0) {
      return NextResponse.json({ error: "User is not head of any clubs." }, { status: 403 });
    }

    const clubsHeadOf = await ClubModel.find(
      { _id: { $in: student.clubsHeadOf } },
      { _id: 1, clubName: 1 }
    );

    if (clubsHeadOf.length === 0) {
      return NextResponse.json({ error: "No clubs found for the user." }, { status: 404 });
    }

    return NextResponse.json(clubsHeadOf, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
