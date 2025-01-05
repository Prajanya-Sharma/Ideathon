import {NextRequest, NextResponse} from "next/server";
import dbConnect from "../../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../../(auth)/auth/[...nextauth]/options";
import mongoose from "mongoose";
import {ClubModel, StudentModel} from "../../../../../../model/User";

export async function PATCH(req: NextRequest,     { params }: { params: { clubId: string[] } }) {
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

    const {clubName, clubLogo, clubIdSecs, clubMembers, clubEvents} = await req.json();

    if (!clubName || clubLogo || !clubIdSecs.length) {
      return NextResponse.json(
        {error: "Data is missing"},
        {status: 403}
      );
    }

    const { clubId } = await params;

    if (!clubId.length) {
      return NextResponse.json(
        {error: 'Club ID is required'},
        {status: 403}
      )
    }

    console.log(clubId);

    if (!mongoose.Types.ObjectId.isValid(clubId[0])) {
      return NextResponse.json(
        {error: 'Club ID is invalid'},
        {status: 403}
      )
    }

    const clubObjectId = new mongoose.Types.ObjectId(clubId[0])

    const club = await ClubModel.findById(clubObjectId);

    if (!club) {
      return NextResponse.json(
        {error: 'Failed to update clubs'},
        {status: 500}
      )
    }

    const removeMember = await StudentModel.updateMany(
      { student_id: { $in: club.clubMembers } },
      { $pull: { clubsPartOf: club._id } }
    );

    const addMember = await StudentModel.updateMany(
      { student_id: { $in: clubMembers } },
      { $addToSet: { clubsPartOf: club._id } }
    );

    if (!addMember.upsertedCount || !removeMember.upsertedCount) {
      return NextResponse.json(
        {error: 'Failed to update members'},
        {status: 500}
      )
    }

    const removeSecy = await StudentModel.updateMany(
      { student_id: { $in: club.clubIdSecs } },
      { $pull: { clubsHeadOf: club._id } }
    );

    const addSecy = await StudentModel.updateMany(
      { student_id: { $in: clubIdSecs } },
      { $addToSet: { clubsHeadOf: club._id } }
    );

    if (!addSecy.upsertedCount || !removeSecy.upsertedCount) {
      return NextResponse.json(
        {error: 'Failed to update secys'},
        {status: 500}
      )
    }


    club.clubName = clubName;
    club.clubLogo = clubLogo;
    club.clubMembers = clubMembers;
    club.clubIdSecs = clubIdSecs;
    club.clubEvents = clubEvents;

    await club.save();

    return NextResponse.json(club, {status: 200});

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}