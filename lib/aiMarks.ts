import { aiChatBotModel, StudentModel } from "../model/User";
import dbConnect from "./connectDb";

export async function getAiMarks(subjectId: string, trimmedRow: any) {
  console.log("inside ai");

  await dbConnect();
  const aiMarks = await aiChatBotModel.findById("676da65f9e48cdfb0b216f48");

  if (!aiMarks) {
    console.log("AI ChatBot not found");
    return null;
  }

  const studentId = trimmedRow.student_id;
  const marks = trimmedRow.marks;
  const subject = trimmedRow.subject;
  const examType = trimmedRow.examType;

  const student = await StudentModel.findOne({ student_id: studentId }).exec();
  const studentName = student?.name;

  if (!studentId || !marks || !subject || !examType) {
    console.log("Missing data in the row:", trimmedRow);
    return null;
  }

  const newMarkMessage = `${studentName} ${studentId} has scored ${marks} in ${examType}`;

  aiMarks.Info.marks = aiMarks.Info.marks || [];
  const existingSubjectMarks = aiMarks.Info.marks.find((mark) => mark.subject === subject);

  if (existingSubjectMarks) {
    const marksArray = existingSubjectMarks.marks.split("\n");
    
    const updatedMarksArray = marksArray.map((entry) => {
      if (entry.includes(`${studentId} has scored`) && entry.includes(examType)) {
        return newMarkMessage;
      }
      return entry;
    });
    if (!updatedMarksArray.includes(newMarkMessage)) {
      updatedMarksArray.push(newMarkMessage);
    }
    existingSubjectMarks.marks = updatedMarksArray.join("\n");
  } else {
    aiMarks.Info.marks.push({ subject: subject, marks: newMarkMessage });
  }

  await aiMarks.save();

  console.log("Marks added/updated successfully:", newMarkMessage);
  return aiMarks;
}
