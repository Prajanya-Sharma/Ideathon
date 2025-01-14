import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {AcceptedStudyRequestModel, RequestToTeachModel, StudyRequestModel} from "@/model/User";
import {uuidV4} from "mongodb/src/utils";

export async function PATCH(req: Request, { params }: { params: { studyRequestId: string[] } }) {
  try {
    console.log("here");
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

    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number not found' },
        {status: 403}
      )
    }

    const studyRequest = await StudyRequestModel.findOne({ _id: studyRequestObjectId, user_id: userId });

    if (!studyRequest) {
      return NextResponse.json(
        {error: "failed to find study request."},
        {status: 500}
      )
    }

    const requestToTeach = await RequestToTeachModel.findOne({ _id: requestToTeachObjectId });

    if (!requestToTeach) {
      return NextResponse.json(
        {error: "failed to find request to teach."},
        {status: 500}
      )
    }

    const acceptedStudyRequest = await AcceptedStudyRequestModel.create({
      studentId: studyRequest.user_id,
      teacherId: requestToTeach.user_id,
      subjectId: studyRequest.subjectId,
      subjectName: studyRequest.subjectName,
      description: studyRequest.description,
      studentAttachments: studyRequest.attachments,
      teacherAttachments: requestToTeach.attachments,
      teacherPhoneNumber: requestToTeach.phoneNumber,
      studentPhoneNumber: phoneNumber,
      roomId: uuidV4(),
    })

    if (!acceptedStudyRequest) {
      return NextResponse.json(
        {error: "failed to accept study request."},
        {status: 500}
      )
    }

    await RequestToTeachModel.deleteMany({studyRequestId: studyRequestObjectId});
    await StudyRequestModel.deleteOne({_id: studyRequestObjectId});

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while updating study request.' }, { status: 500 });
  }
}
