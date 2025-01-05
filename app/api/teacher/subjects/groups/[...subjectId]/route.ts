import dbConnect from "../../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import {AttendanceModel} from "../../../../../../model/User";
import mongoose from "mongoose";

//get all groups of a subject
export async function GET(req: Request, { params }: { params: { subjectId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isTeacher) {
      return NextResponse.json(
        {error: 'User is not teacher'},
        {status: 401}
      );
    }

    const { subjectId } = await params;

    if (!subjectId || subjectId.length === 0) {
      return NextResponse.json(
        {error: 'No subjectId provided'},
        {status: 403}
      )
    }

    const groups = await AttendanceModel.aggregate([
      {
        $match: {
          subjectId: subjectId[0],
        }
      },
      {
        $project: {
          groupName: 1
        }
      }
    ])

    if (!groups) {
      return NextResponse.json(
        {error: "failed to fetch groups"},
        {status: 500}
      )
    }

    return NextResponse.json(groups, {status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


//add a group in a subject
export async function POST(req: Request, { params }: { params: { subjectId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isTeacher) {
      return NextResponse.json(
        {error: 'User is not teacher'},
        {status: 401}
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { subjectId } = await params;

    if (!subjectId || subjectId.length === 0) {
      return NextResponse.json(
        {error: 'No subjectId provided'},
        {status: 403}
      )
    }

    const { groupName } = await req.json();

    if (!groupName) {
      return NextResponse.json(
        {error: "group Name is required"},
        {status: 403}
      )
    }

    const group = await AttendanceModel.create({
      subjectId: subjectId[0],
      groupName,
      teacherId: userId,
      totalClasses: 0,
      dateStudentMap: []
    })

    if (!group) {
      return NextResponse.json(
        {error: " failed to create group"},
        {status: 500}
      )
    }

    return NextResponse.json(group, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


//delete group  subjectId === groupId
export async function DELETE(req: Request, { params }: { params: { subjectId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isTeacher) {
      return NextResponse.json(
        {error: 'User is not teacher'},
        {status: 401}
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { subjectId } = await params;

    if (!subjectId || subjectId.length === 0) {
      return NextResponse.json(
        {error: 'No groupId provided'},
        {status: 403}
      )
    }

    if (!mongoose.Types.ObjectId.isValid(subjectId[0])) {
      return NextResponse.json(
        {error: "invalid group id"},
        {status: 403}
      )
    }

    const groupId = new mongoose.Types.ObjectId(subjectId[0]);

    const group = await AttendanceModel.deleteOne({_id: groupId, teacherId: userId});

    if (!group) {
      return NextResponse.json(
        {error: " failed to delete group"},
        {status: 403}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
