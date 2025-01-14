import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { AttendanceModel, StudentModel } from '@/model/User';
import dbConnect from '@/lib/connectDb'; 
import { authOptions } from '../../(auth)/auth/[...nextauth]/options'; 

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    console.log('Session:', session);
    if (!session || !user || !user._id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const student = await StudentModel.findOne({ user_id: session.user._id }).populate('user_id');

    const attendances = await AttendanceModel.find({
      students: student?.student_id,
      'dateStudentMap.studentsPresent': student?.student_id,
    }).select('subjectId teacherId totalClasses dateStudentMap groupName students')
    if (!attendances || attendances.length === 0) {
      return NextResponse.json({ message: 'No attendance data found' }, { status: 404 });
    }

    const filteredAttendances = attendances.map((attendance) => {
      const filteredDateStudentMap = attendance.dateStudentMap.filter((dateEntry) =>
        dateEntry.studentsPresent.includes(student?.student_id as string)
      );

      return { ...attendance.toObject(), dateStudentMap: filteredDateStudentMap };
    });
    return NextResponse.json(filteredAttendances);

  } catch (error) {
    console.error('Error in GET /api/attendance:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: (error as any).message },
      { status: 500 }
    );
  }
}
