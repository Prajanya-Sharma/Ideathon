import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {StudyRequestModel} from "@/model/User";


export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const studyRequests = await StudyRequestModel.aggregate([
      {
        $match: {
          $nor: [
            { user_id: userId },
            { accepted: true }
          ]
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "user_id",
          foreignField: "user_id",
          as: "user_id",
          pipeline: [
            {
              $project: {
                name: 1,
                student_id: 1,
                branch: 1,
                semester: 1,
                profile: 1
              }
            }
          ]
        }
      },
      {
        $unwind: "$user_id",
      },
      {
        $addFields: {
          isApplied: {
            $in: [userId, "$applied"]
          }
        }
      }
    ])

    if (!studyRequests) {
      return NextResponse.json(
        {error: "failed to fetch study requests"},
        {status: 500}
      )
    }

    console.log(studyRequests);
    return NextResponse.json(studyRequests, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching study requests.' }, { status: 500 });
  }
}



export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { subjectId, subjectName, description, attachments, price} = await req.json();

    if (!subjectName || !subjectId || !description.trim()) {
      return NextResponse.json(
        {error: "data not found for this request."},
        {status: 403}
      )
    }

    const studyRequest = await StudyRequestModel.create({
      user_id: userId,
      subjectId,
      subjectName,
      description,
      attachments,
      price,
      applied: [],
      accepted: false,
    })

    if (!studyRequest) {
      return NextResponse.json(
        {error: "failed to create study request."},
        {status: 500}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while adding study request.' }, { status: 500 });
  }
}