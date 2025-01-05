//get all friends

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
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const student = await StudentModel.aggregate([
      {
        $match: {
          user_id: userId,
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "friends",
          foreignField: "_id",
          as: "friends",
          pipeline: [
            {
              $project: {
                name: 1,
                student_id: 1,
                profile: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          friends: 1
        }
      }
    ])

    if (!student || student.length === 0) {
      return NextResponse.json({ error: 'Not Found' }, {status: 404});
    }

    return NextResponse.json(student[0], {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching friends.' }, { status: 500 });
  }
}