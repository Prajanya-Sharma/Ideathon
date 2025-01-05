import dbConnect from '../../../../lib/connectDb';
import {EventModel, Student, StudentModel} from '../../../../model/User';
import mongoose from "mongoose";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { eventId: string[] } }
) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        if (!session || !user) {
            return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
        }

        const userId = new mongoose.Types.ObjectId(user._id);

        const { eventId } = await params;

        if (!eventId.length) {
            return new Response(
              JSON.stringify({ success: false, message: 'Event ID is required' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log(eventId);

        if (!mongoose.Types.ObjectId.isValid(eventId[0])) {
            return new Response(
              JSON.stringify({ success: false, message: 'Invalid event ID' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const eventObjectId = new mongoose.Types.ObjectId(eventId[0])

        const student: Student|null = await StudentModel.findOne({user_id: userId});

        if (!student) {
            return new Response(
              JSON.stringify({ success: false, message: 'student not found' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const event = await EventModel.aggregate([
            {
                $match: {
                    _id: eventObjectId
                }
            },
            {
                $addFields: {
                    isInterested: {
                        $cond: {
                            if: { $in: [student._id, "$interestedMembersArr"] },
                            then: true,
                            else: false,
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "clubs",
                    localField: "eventHostedBy",
                    foreignField: "_id",
                    as: "eventHostedBy"
                }
            },
            {
                $unwind: "$eventHostedBy"
            },
            {
                $set: {
                    eventHostedBy: "$eventHostedBy.clubName"
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "interestedMembersArr",
                    foreignField: "_id",
                    as: "interestedMembersArr",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                student_id: 1,
                                profile: 1
                            }
                        }
                    ]
                }
            },

        ])
        console.log(event);
        
        if (!event || event.length === 0) {
            return new Response(
                JSON.stringify({ success: false, message: 'Event not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
        return new Response(
            JSON.stringify({ success: true, data: event[0] }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error fetching event:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Server error', error: error }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { eventId: string[] } }
  ) {
    try {
      await dbConnect();
  
      const session = await getServerSession(authOptions);
      const user: User = session?.user as User;
  
      if (!session || !user) {
        return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
      }
  
      const { eventId } = params;
  
      if (!eventId.length || !mongoose.Types.ObjectId.isValid(eventId[0])) {
        return NextResponse.json({ error: 'Invalid or missing Event ID' }, { status: 400 });
      }
  
      const eventObjectId = new mongoose.Types.ObjectId(eventId[0]);
  
      const deletedEvent = await EventModel.findByIdAndDelete(eventObjectId);
  
      if (!deletedEvent) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      return NextResponse.json({ success: false, message: 'Server error', error }, { status: 500 });
    }
  }

  export async function PATCH(
    req: Request,
    { params }: { params: { eventId: string[] } }
  ) {
    try {
      await dbConnect();
  
      const session = await getServerSession(authOptions);
      const user: User = session?.user as User;
  
      if (!session || !user) {
        return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
      }
  
      const { eventId } = params;
  
      if (!eventId.length || !mongoose.Types.ObjectId.isValid(eventId[0])) {
        return NextResponse.json({ error: 'Invalid or missing Event ID' }, { status: 400 });
      }
  
      const eventObjectId = new mongoose.Types.ObjectId(eventId[0]);
  
      const body = await req.json();
  
      if (!body || Object.keys(body).length === 0) {
        return NextResponse.json({ error: 'No data provided for update' }, { status: 400 });
      }
  
      const updatedEvent = await EventModel.findByIdAndUpdate(
        eventObjectId,
        { $set: body },
        { new: true, runValidators: true }
      );
  
      if (!updatedEvent) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, message: 'Event updated successfully', data: updatedEvent });
    } catch (error) {
      console.error('Error updating event:', error);
      return NextResponse.json({ success: false, message: 'Server error', error }, { status: 500 });
    }
  }