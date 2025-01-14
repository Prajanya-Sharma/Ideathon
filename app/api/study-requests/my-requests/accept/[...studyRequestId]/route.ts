import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {
  AcceptedStudyRequestModel,
  RequestToTeach,
  RequestToTeachModel,
  StudyRequest,
  StudyRequestModel
} from "@/model/User";
import {v4 as uuidv4} from "uuid";

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

    const studyRequest: StudyRequest|null = await StudyRequestModel.findOne({ _id: studyRequestObjectId, user_id: userId });

    if (!studyRequest) {
      return NextResponse.json(
        {error: "failed to find study request."},
        {status: 404}
      )
    }

    const requestToTeach: RequestToTeach|null = await RequestToTeachModel.findOne({ _id: requestToTeachObjectId });

    if (!requestToTeach) {
      return NextResponse.json(
        {error: "failed to find request to teach."},
        {status: 404}
      )
    }

    const roomId = `S-${uuidv4()}`;

    const acceptedStudyRequest = await AcceptedStudyRequestModel.create({
      studyRequestId: studyRequestObjectId,
      studentId: studyRequest.user_id,
      teacherId: requestToTeach.user_id,
      subjectId: studyRequest.subjectId,
      subjectName: studyRequest.subjectName,
      description: studyRequest.description,
      studentAttachments: studyRequest.attachments,
      teacherAttachments: requestToTeach.attachments,
      teacherPhoneNumber: requestToTeach.phoneNumber,
      studentPhoneNumber: phoneNumber,
      roomId,
    })

    if (!acceptedStudyRequest) {
      return NextResponse.json(
        {error: "failed to accept study request."},
        {status: 500}
      )
    }
    //
    await RequestToTeachModel.deleteMany({studyRequestId: studyRequestObjectId});
    studyRequest.accepted = true;
    studyRequest.applied = [];
    await studyRequest.save();

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while accepting study request.' }, { status: 500 });
  }
}
