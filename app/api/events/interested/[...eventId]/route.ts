import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/connectDb";
import {EventModel, Student,Event, StudentModel} from "../../../../../model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../../(auth)/auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function PATCH(
    req:Request,
    {params}:{params:{eventId:string[]}}
) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        if (!session || !user) {
            return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
        }

        const { eventId } = await params;

        if (!eventId.length) {
            return new Response(
              JSON.stringify({ success: false, message: 'Event ID is required' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(eventId[0])) {
            return new Response(
              JSON.stringify({ success: false, message: 'Invalid event ID' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const eventObjectId = new mongoose.Types.ObjectId(eventId[0])
        const userId = new mongoose.Types.ObjectId(user._id);

        const event: Event|null = await EventModel.findById(eventObjectId);
        if (!event) {
            return NextResponse.json({ error: "Event not found." }, { status: 404 });
        }

        const student: Student|null = await StudentModel.findOne({ user_id: userId });

        if (!student) {
            return NextResponse.json({ error: "Student not found." }, { status: 404 });
        }

        console.log(student._id);
        console.log(event._id);

        const alreadyInterested = event.interestedMembersArr.includes(student._id as mongoose.Schema.Types.ObjectId);
        console.log(alreadyInterested);

        if (alreadyInterested) {
            event.interestedMembersArr = event.interestedMembersArr.filter((id) => id.toString() != student._id.toString());
            student.interestedEvents = student.interestedEvents.filter((id) => id.toString() != event._id.toString());

            console.log(student.interestedEvents);
            console.log(event.interestedMembersArr);
            await event.save();
            await student.save();

            console.log("removed")
            return NextResponse.json(
              { success: true, message: "Interest removed successfully.", studentInfo : {
                  _id : student._id,
                  profile: student.profile,
                  student_id: student.student_id,
                  name: student.name
              }},
              { status: 200 }
            );
        }

        event.interestedMembersArr = [...event.interestedMembersArr, student._id as mongoose.Schema.Types.ObjectId] ;
        student.interestedEvents = [...student.interestedEvents, event._id as mongoose.Schema.Types.ObjectId];
        console.log(student.interestedEvents);
        console.log(event.interestedMembersArr);

        await event.save();
        await student.save();

        console.log("added")
        return NextResponse.json(
            { success: true, message: "Interest marked successfully.", studentInfo : {
                _id : student._id,
                profile: student.profile,
                student_id: student.student_id,
                name: student.name
            } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in PATCH /interested/:eventId:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}