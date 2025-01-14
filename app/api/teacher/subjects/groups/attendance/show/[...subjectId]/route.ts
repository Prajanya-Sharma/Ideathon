import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import {AttendanceModel} from "@/model/User";

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

    if (!subjectId || subjectId.length < 2) {
      return NextResponse.json(
        {error: 'No subjectId provided'},
        {status: 403}
      )
    }


    const attendance = await AttendanceModel.findOne({subjectId: subjectId[0], groupName: subjectId[1]});

    if (!attendance) {
      return NextResponse.json(
        {error: 'attendance not found'},
        {status: 404}
      )
    }

    return NextResponse.json(attendance, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
