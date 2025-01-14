import dbConnect from "../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import { TeacherModel } from "../../../../model/User";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isTeacher) {
      return NextResponse.json({
        error: 'Unauthorized. User is missing Teacher'
      }, {status: 403})
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const profile = await TeacherModel.findOne({user_id: userId});

    if (!profile) {
      return NextResponse.json({error: "teacher not found"}, {status: 404})
    }

    return NextResponse.json(profile, {status: 200})
  } catch (error) {
    console.error('Error fetching event:', error);
    return new Response(
      JSON.stringify({success: false, message: 'Server error', error: error}),
      {status: 500, headers: {'Content-Type': 'application/json'}}
    );
  }
}
