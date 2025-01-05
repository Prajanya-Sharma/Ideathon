//get subjects

import dbConnect from "../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import {TeacherModel} from "../../../../model/User";
import mongoose from "mongoose";

export async function GET() {
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

    const subjects = await TeacherModel.aggregate([
      {
        $match: {
          user_id: userId
        }
      },
      {
        $project: {
          subjectTeaching: 1
        }
      }
    ])

    if (!subjects || subjects.length === 0) {
      return NextResponse.json(
        {error: "teacher not found."},
        {status: 404}
      )
    }

    return NextResponse.json(subjects[0], {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}