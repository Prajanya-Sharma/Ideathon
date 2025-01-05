import {NextRequest, NextResponse} from "next/server";
import dbConnect from "../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../(auth)/auth/[...nextauth]/options";
import mongoose from "mongoose";
import {ClubModel, StudentModel} from "../../../../../model/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'User is not admin' },
        { status: 401 }
      );
    }

    const {clubName, clubLogo, clubIdSecs, clubMembers} = await req.json();

    if (!clubName || !clubLogo || !clubIdSecs.length) {
      return NextResponse.json(
        { error: 'Data missing' },
        { status: 403 }
      );
    }

    const club = await ClubModel.create({
      clubName,
      clubLogo,
      clubIdSecs,
      clubMembers,
      clubEvents: []
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Failed to create clubs' },
        { status: 500 }
      );
    }

    const secysUpdate = await StudentModel.updateMany(
      { student_id: { $in: clubIdSecs } },
      { $addToSet: { clubsHeadOf: club._id } }
    );

    if (!secysUpdate.modifiedCount) {
      return NextResponse.json(
        { error: "Failed to add club to secys" },
        { status: 500 }
      );
    }

    const membersUpdate = await StudentModel.updateMany(
      { student_id: { $in: clubMembers } },
      { $addToSet: { clubsPartOf: club._id } }
    );

    if (!membersUpdate.modifiedCount) {
      return NextResponse.json(
        { error: "Failed to add club to members" },
        { status: 500 }
      );
    }

    return NextResponse.json(club, {status: 200});

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}