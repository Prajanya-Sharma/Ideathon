import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {StudyRequestModel} from "@/model/User";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const studyRequests = await StudyRequestModel.aggregate([
      {
        $match: {
          user_id: userId,
          accepted: false,
        }
      },
      {
        $set: {
          applied: {
            $size: "$applied",
          }
        }
      }
    ])

    if (!studyRequests) {
      return NextResponse.json(
        {error: "failed to fetch study requests"},
        {status: 500}
      )
    }

    console.log(studyRequests);
    return NextResponse.json(studyRequests, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching study requests.' }, { status: 500 });
  }
}
