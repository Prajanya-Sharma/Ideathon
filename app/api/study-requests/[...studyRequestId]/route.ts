import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {RequestToTeachModel, StudyRequestModel} from "@/model/User";

export async function GET(req: Request, { params }: { params: { studyRequestId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { studyRequestId } = await params;

    if (!studyRequestId || !studyRequestId.length) {
      return NextResponse.json(
        { error: 'Study request id not found.' },
        { status: 403}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(studyRequestId[0])) {
      return NextResponse.json(
        { error: 'Study request id not valid.' },
        { status: 403 }
      );
    }

    const studyRequestObjectId = new mongoose.Types.ObjectId(studyRequestId[0]);

    const studyRequest = await StudyRequestModel.findOne({ _id: studyRequestObjectId, user_id: userId });

    if (!studyRequest || studyRequest.accepted === true) {
      return NextResponse.json({ error: 'Study request not found or accepted' }, {status: 404});
    }

    const requestsToTeach = await RequestToTeachModel.aggregate([
      {
        $match: {
          studyRequestId: studyRequestObjectId
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "user_id",
          foreignField: "user_id",
          as: "teacher",
          pipeline: [
            {
              $lookup: {
                from: "subjects",
                localField: "enrolledSubjectId",
                foreignField: "subjectId",
                as: "subjectMarks",
                let: { student_id: "$student_id" },
                pipeline: [
                  {
                    $project: {
                      subjectId: 1,
                      allMarks: {
                        $map: {
                          input: "$allMarks",
                          as: "marksEntry",
                          in: {
                            examType: "$$marksEntry.examType",
                            marks: {
                              $arrayElemAt: [
                                {
                                  $map: {
                                    input: {
                                      $filter: {
                                        input: "$$marksEntry.studentMarks",
                                        as: "studentMark",
                                        cond: {$eq: ["$$studentMark.student_id", "$$student_id"]}
                                      }
                                    },
                                    as: "filteredMark",
                                    in: "$$filteredMark.marks"
                                  }
                                },
                                0
                              ]
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            },
            {
              $project: {
                _id: 0,
                subjectMarks: 1,
                student_id: 1,
                name: 1,
                profile: 1,
                semester: 1,
                branch: 1
              }
            }
          ]
        }
      },
      {
        $unwind: "$teacher"
      },
      {
        $project: {
          teacher: 1,
          attachments: 1,
          phoneNumber: 1,
          description: 1,
        }
      }
    ])

    if (!requestsToTeach) {
      return NextResponse.json(
        {error: "failed to fetch requests to teach"},
        {status: 500}
      )
    }

    return NextResponse.json({studyRequest, requestsToTeach}, {status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching study request.' }, { status: 500 });
  }
}