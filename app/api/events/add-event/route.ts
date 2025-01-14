import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { EventModel, ClubModel } from '../../../../model/User';
import { StudentModel } from '../../../../model/User';
import dbConnect from '../../../../lib/connectDb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../(auth)/auth/[...nextauth]/options';
import { User } from 'next-auth';
import { saveAIEvents } from '../../../../lib/aiEvents';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        if (!session || !user) {
            return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
        }

        const userId = new mongoose.Types.ObjectId(user._id);

        const {
            poster,
            eventHostedBy,
            eventVenue,
            eventCoordinates,
            eventTime,
            eventAttachments,
            heading,
            description,
            tags,
        } = await req.json();
        const url = req.url;
        const urlParts = url.split('/');
        const aiLink = "http://" + urlParts[2] + "/events/";

        if (!eventHostedBy || !eventVenue || !eventTime || !heading || !description || !poster) {
            return NextResponse.json(
                { error: 'All required fields must be provided.' },
                { status: 400 }
            );
        }
        console.log(heading);

        console.log(eventVenue);

        const club = await ClubModel.findOne({ clubName: eventHostedBy });

        if (!club) {
            return NextResponse.json(
                { error: 'Club not found with the provided club name.' },
                { status: 404 }
            );
        }

        const student = await StudentModel.findOne({ user_id: userId });
        if (!student) {
            return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
        }
        if (!student.clubsHeadOf.includes(club._id as mongoose.Schema.Types.ObjectId)) {
            return NextResponse.json(
                { error: 'Student must be the head of the club to create an event.' },
                { status: 403 }
            );
        }
        if (eventCoordinates) {
            const newEvent = new EventModel({
                eventHostedBy: club._id,
                eventVenue,
                eventCoordinates,
                eventTime,
                poster,
                interestedMembersArr: [],
                eventAttachments: eventAttachments || [],
                heading,
                description,
                tags,
            });
        
            const savedEvent = await newEvent.save();
        
            club.clubEvents.push(savedEvent._id as mongoose.Schema.Types.ObjectId);
            await club.save();
        
            const formattedTags = tags && tags.length > 0 ? tags.join(', ') : 'No tags';
            const formattedDate = new Date(eventTime).toLocaleString();
            
            const aiDescription = `${description}\n\n` +
                `🏢 Hosted by: ${eventHostedBy}\n` +
                `📍 Venue: ${eventVenue}\n` +
                `🕒 Time: ${formattedDate}\n` +
                `🏷️ Tags: ${formattedTags}\n\n` +
                `🔗 Event Link: ${aiLink}${savedEvent._id}`;
        
            console.log("Adding event to AI system...");
            await saveAIEvents(heading, aiDescription);
            console.log("Event added to AI system.");
        
            return NextResponse.json(savedEvent, { status: 200 });
        } else {
            const newEvent = new EventModel({
                eventHostedBy: club._id,
                eventVenue,
                eventTime,
                poster,
                interestedMembersArr: [],
                eventAttachments: eventAttachments || [],
                heading,
                description,
                tags,
            });
        
            const savedEvent = await newEvent.save();
        
            club.clubEvents.push(savedEvent._id as mongoose.Schema.Types.ObjectId);
            await club.save();
        
            const formattedTags = tags && tags.length > 0 ? tags.join(', ') : 'No tags';
            const formattedDate = new Date(eventTime).toLocaleString();
            
            const aiDescription = `${description}\n\n` +
                `🏢 Hosted by: ${eventHostedBy}\n` +
                `📍 Venue: ${eventVenue}\n` +
                `🕒 Time: ${formattedDate}\n` +
                `🏷️ Tags: ${formattedTags}\n\n` +
                `🔗 Event Link: ${aiLink}${savedEvent._id}`;
        
            console.log("Adding event to AI system...");
            await saveAIEvents(heading, aiDescription);
            console.log("Event added to AI system.");
        
            return NextResponse.json(savedEvent, { status: 200 });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
