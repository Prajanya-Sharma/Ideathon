"use client"
import {useEffect, useState} from "react";
import {useModel} from "../../../../../../hooks/user-model-store";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import DotsLoader from "../../../../../../components/loading/dotLoader";

export default function AttendancePage() {
  const [studentsPresent, setStudentsPresent] = useState<string[]>([]);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [lectureCount, setLectureCount] = useState<number>(1);
  const { students, setStudents, isLoading, setLoading } = useModel();
  const router = useRouter();
  const params = useParams();
  const subjectId = params.subjectId?.[0];
  const groupName = params.subjectId?.[1];

  useEffect(() => {
    async function fetchData() {
      if (!subjectId) return;

      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/subjects/groups/attendance/${subjectId}/${groupName}`);
        if (res.status === 200) {
          setStudents(res.data.students);
          console.log(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, setStudents, setLoading, subjectId, groupName]);


  async function handleSubmitAttendance() {
    if (!attendanceDate) {
      alert("Please fill in the attendance date");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/subjects/groups/attendance/${subjectId}`, {
        groupName,
        date: attendanceDate,
        lectureCount,
        studentsPresent,
      });

      if (res.status === 200) {
        alert("Attendance submitted successfully!");
        setTimeout(() => router.push("/teacher/subjects"), 2000);
      } else {
        alert("Failed to submit attendance.");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("An error occurred while submitting attendance.");
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return <DotsLoader />
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-10 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
          Attendance for {groupName || "Group"} in Subject: {subjectId || "N/A"}
        </h1>
      </div>

      {/* Attendance Form */}
      <div className="flex flex-col items-center mt-10 space-y-6 px-4">
        {/* Date Picker */}
        <div className="flex flex-col items-center">
          <label className="text-lg font-semibold text-gray-400 mb-2">
            Select Attendance Date
          </label>
          <input
            type="date"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>

        {/* Lecture Count */}
        <div className="flex flex-col items-center">
          <label className="text-lg font-semibold text-gray-400 mb-2">
            Number of Lectures
          </label>
          <input
            type="number"
            min="1"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={lectureCount}
            onChange={(e) => setLectureCount(Number(e.target.value))}
            placeholder="Enter number of lectures"
          />
        </div>

        {/* Students List */}
        {students && students.length === 0 ? (
          <div className="text-gray-400 text-lg mt-20">
            No students found. Add some students to the group!
          </div>
        ) : (
          <div className="w-full max-w-5xl max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {students.map((student) => (
              <div
                key={student.student_id}
                className="flex flex-row w-full bg-gray-800 rounded-lg shadow-xl items-center justify-between p-6 my-4 hover:scale-105 transform transition-transform duration-300"
              >
                {/* Student Info */}
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="text-lg font-semibold text-white">{student.name}</div>
                    <div className="text-sm text-gray-400">{student.student_id}</div>
                  </div>
                </div>

                {/* Mark Present Button */}
                <button
                  className={`py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
                    studentsPresent.includes(student.student_id)
                      ? "bg-green-700 hover:bg-green-800"
                      : "bg-gray-700 hover:bg-gray-800"
                  }`}
                  onClick={() =>
                    setStudentsPresent((prev) =>
                      prev.includes(student.student_id)
                        ? prev.filter((id) => id !== student.student_id)
                        : [...prev, student.student_id]
                    )
                  }
                >
                  {studentsPresent.includes(student.student_id) ? "Marked Present" : "Mark Present"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Attendance Button */}
      <div className="flex justify-center mt-10">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
          onClick={handleSubmitAttendance}
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}