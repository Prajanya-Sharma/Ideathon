import dbConnect from "@/lib/connectDb";
import mongoose from "mongoose";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import {AnnouncementModel, StudentModel, Student, TeacherAnnouncementModel} from "@/model/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const student: Student|null = await StudentModel.findOne({user_id: userId});

    if (!student) {
      return NextResponse.json(
        { error: 'Unauthorized. User does not exist.' },
        {status: 401}
      )
    }

    const adminAnnouncements = await AnnouncementModel.aggregate([
      {
        $sort: {
          createdAt: -1,
          updatedAt: -1
        }
      }
    ])

    if (!adminAnnouncements) {
      return NextResponse.json(
        {error: "failed to fetch announcements." },
        {status: 500}
      )
    }

    const classAnnouncements = await TeacherAnnouncementModel.aggregate([
      {
        $match: {
          subjectCode: { $in: student.enrolledSubjectId }
        }
      },
      {
        $sort: {
          createdAt: -1,
          updatedAt: -1
        }
      }
    ])

    if (!classAnnouncements) {
      return NextResponse.json(
        {error: "failed to fetch class announcements." },
        {status: 500}
      )
    }
    return NextResponse.json({adminAnnouncements, classAnnouncements}, {status: 200});
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
