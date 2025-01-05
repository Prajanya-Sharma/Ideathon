import dbConnect from "../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {ClubModel} from "../../../../../model/User";

export async function GET(req: Request, { params }: { params: { clubId: string[] } }) {
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

    const {clubId} = await params;

    if (!clubId.length) {
      return NextResponse.json(
        {error: 'No club id found.'},
        {status: 400}
      );
    }

    console.log(clubId);

    if (!mongoose.Types.ObjectId.isValid(clubId[0])) {
      return NextResponse.json(
        {error: 'Invalid club id'},
        {status: 400}
      );
    }

    const clubObjectId = new mongoose.Types.ObjectId(clubId[0]);

    const club = await ClubModel.findById(clubObjectId);

    if (!club) {
      return NextResponse.json(
        {error: 'Club not found'},
        {status: 404}
      )
    }

    return NextResponse.json(
      club,
      {status: 200}
    )
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}