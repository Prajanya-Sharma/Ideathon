import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectDb";
import { StudentModel } from "@/model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json(
        { error: "Unauthorized. User must be logged in." },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    const student = await StudentModel.findOne({ user_id: userId }).populate({
      path: "interestedEvents",
      select: "heading eventVenue eventCoordinates",
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 }
      );
    }

    const eventDetails = student.interestedEvents.map((event: any) => ({
      title: event.heading,
      venue: event.eventVenue,
      coordinates: {
        lat: event.eventCoordinates?.lat,
        lng: event.eventCoordinates?.lng,
      },
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Fetched interested events successfully.",
        events: eventDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /interested-events:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
