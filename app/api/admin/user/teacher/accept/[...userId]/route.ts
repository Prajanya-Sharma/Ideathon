import dbConnect from "../../../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {RequestModel, TeacherModel, UserModel} from "../../../../../../../model/User";
import {v4 as uuidv4} from "uuid";

export async function PATCH(req: Request, { params }: { params: { userId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'User is not admin' },
        { status: 401 }
      );
    }

    const {userId} = await params;

    if (!userId.length) {
      return NextResponse.json(
        {error: 'No user id found.'},
        {status: 400}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId[0])) {
      return NextResponse.json(
        {error: 'Invalid user id'},
        {status: 400}
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId[0]);

    const teacherId = `T-${uuidv4()}`;
    const teacher = await TeacherModel.create({
      user_id: userObjectId,
      teacher_id: teacherId,
      subjectTeaching: []
    })

    if (!teacher) {
      return NextResponse.json(
        {error: 'Failed to create teacher'},
        {status: 500}
      )
    }

    const deleteRequest = await RequestModel.deleteOne({user_id: userObjectId});

    if (!deleteRequest) {
      return NextResponse.json(
        {error: 'Failed to delete request'},
        {status: 500}
      )
    }

    const userTeacher = await UserModel.findByIdAndUpdate(userObjectId, {reqTeacher: false, isTeacher: true});

    if (!userTeacher) {
      return NextResponse.json(
        {error: "failed to found user"},
        {status: 404}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}