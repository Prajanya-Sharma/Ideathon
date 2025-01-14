import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { writeFile, createReadStream } from "fs";
import { unlink } from "fs/promises";
import { join } from "path";
import csvParser from "csv-parser";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import dbConnect from "../../../../lib/connectDb";
import { SubjectModel } from "../../../../model/User";
import { getAiMarks } from "../../../../lib/aiMarks";

interface CSVRow {
  student_id: string;
  [key: string]: string;
}

export async function PATCH(
  req: NextRequest
) {
  let filePath: string | null = null;

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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    const subjectId = formData.get("subjectId")?.toString();

    if (!subjectId) {
      return NextResponse.json(
        { error: "Subject ID is required in the form data." },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Only CSV files are allowed" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    filePath = join("/tmp", `upload-${timestamp}.csv`);

    await new Promise((resolve, reject) => {
      writeFile(filePath!, buffer, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const updates = new Map<string, { [examType: string]: { studentMarks: { student_id: string, marks: number }[] } }>();

    await new Promise<void>((resolve, reject) => {
      createReadStream(filePath!)
        .pipe(csvParser())
        .on("data", (row: CSVRow) => {
          const trimmedRow = Object.keys(row).reduce((acc, key) => {
            acc[key.trim()] = row[key].trim();
            return acc;
          }, {} as CSVRow);
    
          const studentId = trimmedRow.student_id;
          if (!studentId) return;
          for (const [key, value] of Object.entries(trimmedRow)) {
            if (key === "student_id") continue;
    
            const marks = parseFloat(value);
            if (!isNaN(marks) && marks >= 0) {
              const examType = key;
              
              if (!updates.has(subjectId)) {
                updates.set(subjectId, {});
              }
              const subjectUpdates = updates.get(subjectId)!;
    
              if (!subjectUpdates[examType]) {
                subjectUpdates[examType] = { studentMarks: [] };
              }
    
              subjectUpdates[examType].studentMarks.push({
                student_id: studentId,
                marks: marks,
              });
            }
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(updates);

    const formattedSubjectUpdates = Array.from(updates.entries()).map(
      ([subject, examData]) => ({
        subjectId: subject,
        allMarks: Object.entries(examData).map(([examType, data]) => ({
          examType,
          studentMarks: data.studentMarks,
        })),
      })
    );

    for (const subjectUpdate of formattedSubjectUpdates) {
      const subject = await SubjectModel.findOne({ subjectId: subjectUpdate.subjectId });

      if (!subject) {
        const newSubject = new SubjectModel({
          subjectId: subjectUpdate.subjectId,
          allMarks: subjectUpdate.allMarks,
        });
        await newSubject.save();
      } else {
        if (!Array.isArray(subject.allMarks)) {
          subject.allMarks = [];
        }

        for (const examData of subjectUpdate.allMarks) {
          const { examType, studentMarks } = examData;

          const examTypeData = subject.allMarks.find((exam) => exam.examType === examType);

          if (examTypeData) {
            for (const studentMark of studentMarks) {
              const { student_id, marks } = studentMark;
              const existingStudentMark = examTypeData.studentMarks.find(
                (student) => student.student_id === student_id
              );

              if (existingStudentMark) {
                existingStudentMark.marks = marks;
              } else {
                examTypeData.studentMarks.push({ student_id, marks });
              }
            }
          } else {
            subject.allMarks.push({
              examType,
              studentMarks,
            });
          }
        }

        await subject.save();
      }

      for (const examData of subjectUpdate.allMarks) {
        for (const studentMark of examData.studentMarks) {
          const trimmedRow = { student_id: studentMark.student_id, marks: studentMark.marks.toString(), subject: subjectUpdate.subjectId, examType: examData.examType };
          await getAiMarks(subjectUpdate.subjectId, trimmedRow);
        }
      }
    }

    return NextResponse.json({
      message: "Marks updated successfully.",
      subjectsUpdated: updates.size,
    });
  } catch (error) {
    console.error("CSV processing error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing the file.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    if (filePath) {
      try {
        await unlink(filePath);
      } catch (error) {
        console.error("Failed to delete temporary file:", error);
      }
    }
  }
}
