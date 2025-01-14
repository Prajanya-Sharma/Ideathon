import dbConnect from "@/lib/connectDb";
import mongoose from "mongoose";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User, AnnouncementModel } from "@/model/User";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        {error: 'User is not admin'},
        {status: 401}
      );
    }

    const announcements = await AnnouncementModel.find();

    if (!announcements) {
      return NextResponse.json(
        { error: "failed to fetch announcements" },
        { status: 500 }
      )
    }

    return NextResponse.json(announcements, {status: 200});
  } catch (error) {
    console.error("Announcement creation error:", error);

    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



export async function POST(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        {error: 'User is not admin'},
        {status: 401}
      );
    }

    const { announcementText, department } = await request.json();

    if (!announcementText.trim() || typeof announcementText !== 'string') {
      return NextResponse.json(
        { error: "Valid description is required" },
        { status: 400 }
      );
    }

    if (!department.trim() || typeof department !== 'string') {
      return NextResponse.json(
        { error: "Valid department is required" },
        { status: 400 }
      );
    }

    const announcement = new AnnouncementModel({
      announcementText,
      department,
    });

    await announcement.save();

    return NextResponse.json(
      announcement,
      { status: 200 }
    );

  } catch (error) {
    console.error("Announcement creation error:", error);

    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}