import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {IssueModel} from "@/model/User";


export async function GET(req: Request, { params }: { params: { issueId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { issueId } = await params;

    if (!issueId.length) {
      return NextResponse.json(
        {error: "issue id not found"},
        {status: 403}
      )
    }

    if (!mongoose.Types.ObjectId.isValid(issueId[0])) {
      return NextResponse.json(
        {error: "issue id not valid"},
        {status: 403}
      )
    }

    const issue = await IssueModel.findOne({_id: issueId, author: userId});

    if (!issue) {
      return NextResponse.json(
        {error: "failed to get issue"},
        {status: 500}
      )
    }

    return NextResponse.json(issue, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching issue.' }, { status: 500 });
  }
}



export async function DELETE(req: Request, { params }: { params: { issueId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { issueId } = await params;

    if (!issueId.length) {
      return NextResponse.json(
        {error: "issue id not found"},
        {status: 403}
      )
    }

    if (!mongoose.Types.ObjectId.isValid(issueId[0])) {
      return NextResponse.json(
        {error: "issue id not valid"},
        {status: 403}
      )
    }

    const issue = await IssueModel.deleteOne({_id: issueId, author: userId});

    if (!issue) {
      return NextResponse.json(
        {error: "failed to delete issue"},
        {status: 500}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while deleting issue.' }, { status: 500 });
  }
}



export async function PATCH(req: Request, { params }: { params: { issueId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const {title, description, attachments} = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        {error: "data not provided."},
        {status: 403}
      )
    }

    const { issueId } = await params;

    if (!issueId.length) {
      return NextResponse.json(
        {error: "issue id not provided."},
        {status: 403}
      )
    }

    if (!mongoose.Types.ObjectId.isValid(issueId[0])) {
      return NextResponse.json(
        {error: "issue id is invalid."},
        {status: 403}
      )
    }

    const issueObjectId = new mongoose.Types.ObjectId(issueId[0]);


    const issue = await IssueModel.findOneAndUpdate(
      {_id: issueObjectId, author: userId},
      {
        title,
        description,
        attachments,
      }
    )

    if (!issue) {
      return NextResponse.json(
        {error: "failed to create issue"},
        {status: 500}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while upadting issue.' }, { status: 500 });
  }
}