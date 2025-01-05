//get all teachers

import dbConnect from "../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import {TeacherModel} from "../../../../../model/User";

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

    const teachers = await TeacherModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                _id: 0,
                username: 1,
                email: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          user: 1,
          teacher_id: 1,
          subjectTeaching: 1
        }
      }
    ])

    if (!teachers) {
      return NextResponse.json(
        {error: 'error occurred while retrieving teacher.'},
        {status: 500}
      )
    }

    return NextResponse.json(teachers, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}