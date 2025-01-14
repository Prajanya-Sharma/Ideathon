import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {AcceptedStudyRequestModel} from "@/model/User";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const acceptedRequestsToTeach = await AcceptedStudyRequestModel.aggregate([
      {
        $match: {
          teacherId: userId,
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "user_id",
          as: "student",
          pipeline: [
            {
              $project: {
                name: 1,
                student_id: 1,
                semester: 1,
                branch: 1,
                profile: 1
              }
            }
          ]
        }
      },
      {
        $unwind: "$student"
      },
      {
        $project: {
          student: 1,
          subjectId: 1,
          subjectName: 1,
          description: 1,
          studentAttachments: 1,
          teacherAttachments: 1,
          studentPhoneNumber: 1,
          roomId: 1,
        }
      }
    ])

    if (!acceptedRequestsToTeach) {
      return NextResponse.json(
        {error: "failed to fetch accepted requests to teach"},
        {status: 500}
      )
    }

    return NextResponse.json(acceptedRequestsToTeach, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching study requests.' }, { status: 500 });
  }
}