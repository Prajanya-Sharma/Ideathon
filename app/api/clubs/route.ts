import dbConnect from "../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import {ClubModel} from "../../../model/User";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const clubs = await ClubModel.aggregate([
      {
        $project: {
          _id: 1,
          clubName: 1,
          clubLogo: 1,
        }
      }
    ])

    if (!clubs) {
      return NextResponse.json({error: 'No clubs found'}, {status: 404});
    }
    return NextResponse.json(clubs, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching clubs.' }, { status: 500 });
  }
}