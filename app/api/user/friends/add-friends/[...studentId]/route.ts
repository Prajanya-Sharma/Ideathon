//send friend request

import dbConnect from "../../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {FriendRequestModel} from "../../../../../../model/User";

export async function POST(req: Request, { params } : { params : { studentId: string[] } } )  {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const { studentId } = await params;

    if (!studentId || studentId.length < 2) {
      return NextResponse.json(
        {error: "student id not found"},
        {status: 403}
      )
    }

    if (!mongoose.Types.ObjectId.isValid(studentId[0]) || !mongoose.Types.ObjectId.isValid(studentId[1])) {
      return NextResponse.json(
        { error: "student id is not valid" }
      );
    }

    const from = new mongoose.Types.ObjectId(studentId[0]);
    const to = new mongoose.Types.ObjectId(studentId[1]);

    const alreadyFriendRequest = await FriendRequestModel.findOne({from, to})

    if (alreadyFriendRequest) {
      return NextResponse.json({error: "Other student has already sent you friend request"}, {status: 403});
    }

    const friendRequest = await FriendRequestModel.create({
      from,
      to
    })

    if (!friendRequest) {
      return NextResponse.json(
        {error: "Failed to create friend request"},
        {status: 500}
      )
    }

    return NextResponse.json(friendRequest, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching students.' }, { status: 500 });
  }
}