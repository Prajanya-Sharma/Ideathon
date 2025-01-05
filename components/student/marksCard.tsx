import Marks from "./marks";
import { subjectMarks } from "../../types/SubjectMakrs";

interface MarksCardProps {
  subjectMarks: subjectMarks;
}

export default function MarksCard({ subjectMarks }: MarksCardProps) {
  return (
    <div className="flex flex-col w-full max-w-4xl p-6 bg-gradient-to-b from-[#0B0C10] to-[#1F2833] border-2 rounded-xl border-cyan-300 shadow-lg shadow-cyan-300/50">
      {subjectMarks.map((subject) => (
        <div key={subject.subjectId} className="mb-6">
          <div className="ml-4 mt-2 text-lg md:text-xl font-bold text-[#66FCF1]">
            Subject Code: {subject.subjectId}
          </div>
          <div className="flex flex-col space-y-4 mt-4">
            {subject.allMarks.map((singleMark, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-between bg-[#1F2833] text-white p-4 rounded-lg shadow-md shadow-cyan-300/50 hover:shadow-2xl transition-all duration-300">
                <Marks type={singleMark.examType} marks={singleMark.marks} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
