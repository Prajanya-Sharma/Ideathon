import dbConnect from "../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {ClubModel} from "../../../../model/User";

export async function GET(
  req: Request,
  { params }: { params: { clubId: string[] } }
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const {clubId} = await params;

    if (!clubId.length) {
      return new Response(
        JSON.stringify({ success: false, message: 'Club ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(clubId);

    if (!mongoose.Types.ObjectId.isValid(clubId[0])) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid clubs ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const clubObjectId = new mongoose.Types.ObjectId(clubId[0]);

    const club = await ClubModel.aggregate([
      {
        $match: {
          _id: clubObjectId,
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "clubIdSecs",
          foreignField: "student_id",
          as: "clubIdSecs",
          pipeline: [
            {
              $project: {
                user_id:1,
                profile: 1,
                student_id: 1,
                name: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "clubMembers",
          foreignField: "student_id",
          as: "clubMembers",
          pipeline: [
            {
              $project: {
                profile: 1,
                student_id: 1,
                name: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "events",
          localField: "clubEvents",
          foreignField: "_id",
          as: "clubEvents",
          pipeline: [
            {
              $addFields: {
                isInterested: {
                  $cond: {
                    if: { $in: [userId, "$interestedMembersArr"] },
                    then: true,
                    else: false,
                  }
                }
              }
            },
            {
              $project: {
                _id: 1,
                heading: 1,
                isInterested: 1,
                eventTime: 1,
                eventVenue: 1
              }
            }
          ]
        }
      }
    ])

    if (!club || club.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Club not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ success: true, data: club[0] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Server error', error: error }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}