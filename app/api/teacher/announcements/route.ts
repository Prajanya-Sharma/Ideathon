import dbConnect from "@/lib/connectDb";
import mongoose from "mongoose";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import {TeacherAnnouncementModel} from "@/model/User";
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

        const userId = new mongoose.Types.ObjectId(user._id);

        const announcements = await TeacherAnnouncementModel.aggregate([
            {
                $match: {
                    teacherId: userId
                }
            },
            {
                $project: {
                    announcementText: 1,
                    subjectCode: 1
                }
            }
        ]);

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

        if (!user.isTeacher) {
            return NextResponse.json(
              {error: 'User is not teacher'},
              {status: 401}
            );
        }

        const userId = new mongoose.Types.ObjectId(user._id);

        const { announcementText, subjectCode } = await request.json();

        if (!announcementText.trim() || !subjectCode.trim()) {
            return NextResponse.json(
                { error: "announcementText and subject code is required." },
                { status: 400 }
            );
        }

        const announcement = await TeacherAnnouncementModel.create({
            teacherId: userId,
            announcementText,
            subjectCode,
        })

        if (!announcement) {
            return NextResponse.json(
              {error: "failed to create announcement"},
              {status: 500}
            )
        }
        return NextResponse.json({ status: 200 });
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