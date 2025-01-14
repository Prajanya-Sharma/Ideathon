import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {AcceptedStudyRequestModel, StudyRequestModel} from "@/model/User";


// handle cancel meeting
export async function PATCH(req: Request, { params }: { params: { acceptedStudyRequestId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    const { acceptedStudyRequestId } = await params;

    if (!acceptedStudyRequestId || !acceptedStudyRequestId.length) {
      return NextResponse.json(
        { error: 'Study request id not found.' },
        { status: 403}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(acceptedStudyRequestId[0])) {
      return NextResponse.json(
        { error: 'Study request id not valid.' },
        { status: 403 }
      );
    }

    const acceptedStudyRequestObjectId = new mongoose.Types.ObjectId(acceptedStudyRequestId[0]);

    const acceptedStudyRequest = await AcceptedStudyRequestModel.findOneAndDelete({_id: acceptedStudyRequestObjectId, teacherId: userId});

    if (!acceptedStudyRequest) {
      return NextResponse.json({ error: 'Accepted Study request not found.' }, {status: 404});
    }

    const studyRequest = await StudyRequestModel.findByIdAndUpdate(acceptedStudyRequest.studyRequestId, {accepted: false});

    if (!studyRequest) {
      return NextResponse.json(
        {error: 'Study request not found.' },
        {status: 404}
      )
    }

    return NextResponse.json({status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching study requests.' }, { status: 500 });
  }
}