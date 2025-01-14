import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {RequestToTeachModel, StudyRequest, StudyRequestModel} from "@/model/User";

export async function DELETE(req: Request, { params } : { params : { studyRequestId: string } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { studyRequestId } = await params;

    if (!studyRequestId || studyRequestId.length < 2) {
      return NextResponse.json(
        { error: 'Study request id not found.' },
        { status: 403}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(studyRequestId[0]) || !mongoose.Types.ObjectId.isValid(studyRequestId[1])) {
      return NextResponse.json(
        { error: 'Study request id not valid.' },
        { status: 403 }
      );
    }

    const studyRequestObjectId = new mongoose.Types.ObjectId(studyRequestId[0]);
    const requestToTeachObjectId = new mongoose.Types.ObjectId(studyRequestId[1]);

    const studyRequest: StudyRequest|null = await StudyRequestModel.findOne({ _id: studyRequestObjectId, user_id: userId });

    if (!studyRequest) {
      return NextResponse.json(
        {error: "failed to find study request."},
        {status: 500}
      )
    }

    const requestToTeach = await RequestToTeachModel.findOne({ _id: requestToTeachObjectId, studyRequestId: studyRequestObjectId });

    if (!requestToTeach) {
      return NextResponse.json(
        {error: "failed to find request to teach."},
        {status: 500}
      )
    }

    studyRequest.applied = studyRequest.applied.filter(applied => applied.toString() !== requestToTeach.user_id.toString());
    await studyRequest.save();

    await RequestToTeachModel.deleteOne({ _id: requestToTeachObjectId });

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while updating study request.' }, { status: 500 });
  }
}