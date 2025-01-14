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

    const acceptedRequests = await AcceptedStudyRequestModel.aggregate([
      {
        $match: {
          studentId: userId,
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "teacherId",
          foreignField: "user_id",
          as: "teacher",
          pipeline: [
            {
              $project: {
                _id: 0,
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
        $unwind: "$teacher"
      },
      {
        $project: {
          teacher: 1,
          subjectId: 1,
          subjectName: 1,
          description: 1,
          studentAttachments: 1,
          teacherAttachments: 1,
          teacherPhoneNumber: 1,
          roomId: 1,
        }
      }
    ])

    if (!acceptedRequests) {
      return NextResponse.json(
        {error: "failed to fetch accepted requests"},
        {status: 500}
      )
    }

    return NextResponse.json(acceptedRequests, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching study requests.' }, { status: 500 });
  }
}
