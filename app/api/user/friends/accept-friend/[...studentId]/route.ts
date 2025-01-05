//accept friend request

import dbConnect from "../../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {FriendRequestModel, StudentModel} from "../../../../../../model/User";

export async function PATCH(req: Request, { params } : { params : { studentId: string[] } } )  {
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
        { error: "student id is not valid" },
        { status: 403 }
      );
    }

    const to = new mongoose.Types.ObjectId(studentId[0]);
    const from = new mongoose.Types.ObjectId(studentId[1]);

    const deleteRequest = await FriendRequestModel.deleteOne({from, to});

    console.log("here")
    if (!deleteRequest) {
      return NextResponse.json(
        {error: "failed to delete friend request"},
        {status: 500}
      )
    }

    console.log("here2")
    const student1Update = await StudentModel.updateOne(
      { _id: to },
      {  $addToSet: { friends: from } }
    );

    const student2Update = await StudentModel.updateOne(
      { _id: from },
      { $addToSet: { friends: to } }
    );

    if (!student1Update.modifiedCount || !student2Update.modifiedCount) {
      return NextResponse.json(
        { error: "Failed to update friends for one or both students" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {status: 200},
    )
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while accepting request.' }, { status: 500 });
  }
}