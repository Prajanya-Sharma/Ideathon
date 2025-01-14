import { NextRequest, NextResponse } from 'next/server';  // Use NextRequest and NextResponse
import { getSession } from 'next-auth/react';
import { TeacherModel, SubjectModel } from '@/model/User';
import dbConnect from '@/lib/connectDb';
import { authOptions } from '../../(auth)/auth/[...nextauth]/options';
import { getServerSession, User } from 'next-auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log('DB connection successful');

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    console.log('Session:', session);

    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const teacher = await TeacherModel.findOne({ user_id: session.user._id }).populate('user_id');
    console.log('Teacher found:', teacher);

    if (!teacher) {
      return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
    }

    const subjects = teacher.subjectTeaching;
    const marks = await Promise.all(
      subjects.map(async (subject) => {
        const subjectMarks = await SubjectModel.findOne({ subjectId: subject.subject_code });

        if (!subjectMarks) {
          return { subject_name: subject.subject_name, marks: [] };
        }

        return {
          subject_name: subject.subject_name,
          marks: subjectMarks.allMarks,
        };
      })
    );

    return NextResponse.json(marks);  // Return response using NextResponse
  } catch (error) {
    console.error('Error in GET /api/marks:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: (error as any).message },
      { status: 500 }
    );
  }
}
