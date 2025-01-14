//get the students enrolled in subject in get and mark subjects in patch

import dbConnect from "../../../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import { AttendanceModel } from "../../../../../../../model/User";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: { subjectId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isTeacher) {
      return NextResponse.json(
        {error: 'User is not teacher'},
        {status: 401}
      );
    }

    const { subjectId } = await params;

    if (!subjectId || subjectId.length < 2) {
      return NextResponse.json(
        {error: 'No subjectId provided'},
        {status: 403}
      )
    }


    const students = await AttendanceModel.aggregate([
      {
        $match: {
          subjectId: subjectId[0],
          groupName: subjectId[1],
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "students",
          foreignField: "student_id",
          as: "students",
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1,
                student_id: 1,
              }
            }
          ]
        }
      }
    ])

    if (!students) {
      return NextResponse.json(
        {error: 'student not found'},
        {status: 404}
      )
    }

    return NextResponse.json(students[0], {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}



export async function POST(req: Request, { params }: { params: { subjectId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isTeacher) {
      return NextResponse.json(
        {error: 'User is not teacher'},
        {status: 401}
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { subjectId } = await params;

    if (!subjectId || subjectId.length === 0) {
      return NextResponse.json(
        {error: 'No subjectId provided'},
        {status: 403}
      )
    }

    const { groupName, studentsPresent, lectureCount, date } = await req.json();

    if (!groupName || !lectureCount || !date) {
      return NextResponse.json(
        {error: "information missing"},
        {status: 403}
      )
    }

    const attendance = await AttendanceModel.updateOne(
      {subjectId: subjectId[0], teacherId: userId, groupName: groupName},
      {
        $inc: { totalClasses: lectureCount },
        $push: { dateStudentMap: { date, studentsPresent, lectureCount } }
      }
    )

    if (!attendance.modifiedCount) {
      return NextResponse.json(
        {error: "Failed to mark attendance"},
        {status: 500}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}