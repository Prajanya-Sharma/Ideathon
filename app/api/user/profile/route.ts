import dbConnect from "../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import  {StudentModel} from "../../../../model/User";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const profile = await StudentModel.aggregate([
      {
        $match: {
          user_id: userId
        }
      },
      {
        $lookup: {
          from: "clubs",
          localField: "clubsPartOf",
          foreignField: "_id",
          as: "clubsPartOf",
          pipeline: [
            {
              $project: {
                _id: 1,
                clubName: 1,
                clubLogo: 1
              }
            }
          ]
        }
      },
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
                                  cond: { $eq: ["$$studentMark.student_id", "$$student_id"] }
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
          name: 1,
          student_id: 1,
          semester: 1,
          branch: 1,
          profile: 1,
          subjectMarks: 1,
          clubsPartOf: 1
        }
      }
    ]);
    
    

    if (!profile || profile.length == 0) {
      return new Response(
        JSON.stringify({success: false, message: "profile not found"}),
        {status: 404, headers: {'Content-Type': 'application/json'}}
      );
    }

    console.log(profile);
    return new Response(
      JSON.stringify({success: true, data: profile[0]}),
      {status: 200, headers: {'Content-Type': 'application/json'}}
    );

  } catch (error) {
    console.error('Error fetching event:', error);
    return new Response(
      JSON.stringify({success: false, message: 'Server error', error: error}),
      {status: 500, headers: {'Content-Type': 'application/json'}}
    );
  }
}
