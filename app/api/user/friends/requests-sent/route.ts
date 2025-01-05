import dbConnect from "../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {FriendRequestModel, StudentModel} from "../../../../../model/User";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const student = await StudentModel.findOne({user_id: userId});

    if (!student) {
      return NextResponse.json(
        { error: 'Unauthorized. User does not exist.' },
        {status: 401}
      )
    }

    const requests = await FriendRequestModel.aggregate([
      {
        $match: {
          from: student._id,
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "to",
          foreignField: "_id",
          as: "to",
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
        $unwind: "$to"
      }
    ])

    if (!requests) {
      return NextResponse.json({ error: 'Not Found' }, {status: 404});
    }

    return NextResponse.json(requests, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching request sent.' }, { status: 500 });
  }
}