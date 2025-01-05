//get all requests for admin

import dbConnect from "../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import {RequestModel} from "../../../../../model/User";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        {error: 'User is not admin'},
        {status: 401}
      );
    }

    const requests = await RequestModel.aggregate([
      {
        $match: {
          for_admin: true,
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                username: 1,
                email: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          user: 1
        }
      }
    ])

    if (!requests) {
      return NextResponse.json(
        {error: "failed to fetch requests"},
        {status: 500}
      )
    }

    return NextResponse.json(requests, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}