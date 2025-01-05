//remove a subject

import dbConnect from "../../../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {TeacherModel} from "../../../../../../../model/User";

export async function PATCH(req: Request, { params }: { params: { teacherId: string[] } }) {
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

    const { subject_code, subject_name} = await req.json()

    if (!subject_code || !subject_name) {
      return NextResponse.json(
        {error: "Subject code and name is required"},
        {status: 403}
      )
    }
    const { teacherId } = await params;

    if (!teacherId.length) {
      return NextResponse.json(
        {error: 'No teacher id found.'},
        {status: 400}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(teacherId[0])) {
      return NextResponse.json(
        {error: 'Invalid teacher id'},
        {status: 400}
      );
    }

    const teacherObjectId = new mongoose.Types.ObjectId(teacherId[0]);

    const teacher = await TeacherModel.findOne(teacherObjectId);

    if (!teacher) {
      return NextResponse.json(
        {error: 'Teacher not found'},
        {status: 404}
      )
    }

    teacher.subjectTeaching = teacher.subjectTeaching.filter((subjectTeaching) => !(subjectTeaching.subject_code === subject_code && subjectTeaching.subject_name === subject_name));
    await teacher.save();

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
