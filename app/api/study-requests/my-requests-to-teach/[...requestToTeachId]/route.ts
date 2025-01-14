import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {RequestToTeachModel, StudyRequestModel} from "@/model/User";


export async function GET(req: Request, {params} : {params: {requestToTeachId: string[]}}) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { requestToTeachId } = await params;

    if (!requestToTeachId || requestToTeachId.length < 1) {
      return NextResponse.json(
        { error: 'Study request id not found.' },
        { status: 403}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(requestToTeachId[0])) {
      return NextResponse.json(
        { error: 'Study request id not valid.' },
        { status: 403 }
      );
    }

    const requestToTeachObjectId = new mongoose.Types.ObjectId(requestToTeachId[0]);

    const requestToTeach = await RequestToTeachModel.findOne({_id: requestToTeachObjectId, user_id: userId});

    if (!requestToTeach) {
      return NextResponse.json({ error: 'request to teach not found.' }, {status: 404});
    }

    return NextResponse.json(requestToTeach, {status:200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while deleting request to teach.' }, { status: 500 });
  }
}


export async function PATCH(req: Request, {params} : {params: {requestToTeachId: string[]}}) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { requestToTeachId } = await params;

    if (!requestToTeachId || requestToTeachId.length < 1) {
      return NextResponse.json(
        { error: 'Study request id not found.' },
        { status: 403}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(requestToTeachId[0])) {
      return NextResponse.json(
        { error: 'Study request id not valid.' },
        { status: 403 }
      );
    }

    const requestToTeachObjectId = new mongoose.Types.ObjectId(requestToTeachId[0]);

    const { description, phoneNumber, attachments } = await req.json();

    const request = await RequestToTeachModel.findOneAndUpdate(
      {_id: requestToTeachObjectId, user_id: userId},
      {
        description,
        phoneNumber,
        attachments,
      }
    );

    if (!request) {
      return NextResponse.json({
        error: "failed to update request to teach"
      }, {status: 500})
    }
    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while deleting request to teach.' }, { status: 500 });
  }
}



export async function DELETE(req: Request, {params} : {params: {requestToTeachId: string[]}}) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { requestToTeachId } = await params;

    if (!requestToTeachId || requestToTeachId.length < 2) {
      return NextResponse.json(
        { error: 'Study request id not found.' },
        { status: 403}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(requestToTeachId[0]) || !mongoose.Types.ObjectId.isValid(requestToTeachId[1])) {
      return NextResponse.json(
        { error: 'Study request id not valid.' },
        { status: 403 }
      );
    }

    const requestToTeachObjectId = new mongoose.Types.ObjectId(requestToTeachId[0]);
    const studyRequestObjectId = new mongoose.Types.ObjectId(requestToTeachId[1]);

    const studyRequest = await StudyRequestModel.findByIdAndUpdate(studyRequestObjectId, {$pull: { applied: userId }});

    if (!studyRequest) {
      return NextResponse.json({ error: 'failed to remove user from applied.' }, {status: 500});
    }

    const request = await RequestToTeachModel.findOneAndDelete({_id: requestToTeachObjectId, user_id: userId});

    if (!request) {
      return NextResponse.json({
        error: "failed to delete request to teach"
      }, {status: 500})
    }
    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while deleting request to teach.' }, { status: 500 });
  }
}