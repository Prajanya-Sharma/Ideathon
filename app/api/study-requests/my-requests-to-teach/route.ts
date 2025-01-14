//get all

import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {RequestToTeachModel} from "@/model/User";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const myRequestsToTeach = await RequestToTeachModel.aggregate([
      {
        $match: {
          user_id: userId,
        }
      },
      {
        $lookup: {
          from: "studyrequests",
          localField: "studyRequestId",
          foreignField: "_id",
          as: "studyRequest",
          pipeline: [
            {
              $lookup: {
                from: "students",
                localField: "user_id",
                foreignField: "user_id",
                as: "author",
                pipeline: [
                  {
                    $project: {
                      _id: 0,
                      name: 1,
                      student_id: 1,
                      profile: 1
                    }
                  }
                ]
              }
            },
            {
              $unwind: "$author",
            },
            {
              $project: {
                author: 1,
                subjectId: 1,
                subjectName: 1,
                description: 1,
                attachments: 1,
                price: 1,
                applied: {
                  $size: "$applied"
                }
              }
            }
          ]
        }
      },
      {
        $unwind: "$studyRequest"
      },
      {
        $project: {
          studyRequest: 1,
          description: 1,
          attachments: 1,
          phoneNumber: 1,
        }
      }
    ])

    if (!myRequestsToTeach) {
      return NextResponse.json(
        {error: "failed to fetch requests to teach."},
        {status: 500}
      )
    }

    return NextResponse.json(myRequestsToTeach, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching study requests.' }, { status: 500 });
  }
}
