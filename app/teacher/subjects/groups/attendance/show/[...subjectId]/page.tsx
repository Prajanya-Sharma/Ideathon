"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {useParams} from "next/navigation";
import DotsLoader from "@/components/loading/dotLoader";

interface Attendance {
  subjectId: string;
  teacherId: string;
  totalClasses: number;
  dateStudentMap: {
    date: string;
    studentsPresent: string[];
    lectureCount: number;
  }[];
  groupName: string;
  students: string[];
}

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<Attendance | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const params = useParams();
  const subjectId = params.subjectId?.[0];
  const groupName = params.subjectId?.[1];

  useEffect(() => {
    async function fetchAttendance() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/subjects/groups/attendance/show/${subjectId}/${groupName}`
        );
        if (res.status === 200) {
          setAttendanceData(res.data);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAttendance();
  }, [subjectId, groupName]);

  if (isLoading) {
    return (
      <DotsLoader />
    );
  }

  if (!attendanceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1>No attendance data available.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-8">
        Attendance for {attendanceData.groupName}
      </h1>

      {/* Table Container */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-700">
        <table className="min-w-full bg-gray-800 rounded-lg">
          {/* Table Header */}
          <thead>
          <tr className="bg-gray-700 text-gray-300">
            <th className="px-6 py-4 text-left font-semibold text-sm border-b border-gray-600">
              Student ID
            </th>
            {attendanceData.dateStudentMap.map((entry) => (
              <th
                key={entry.date}
                className="px-6 py-4 text-center font-semibold text-sm border-b border-gray-600"
              >
                {entry.date} <br />
                <span className="text-xs text-gray-400">
                    {entry.lectureCount} Lectures
                  </span>
              </th>
            ))}
          </tr>
          </thead>

          {/* Table Body */}
          <tbody>
          {attendanceData.students.map((studentId, index) => (
            <tr
              key={studentId}
              className={
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
              }
            >
              <td className="px-6 py-4 text-left border-b border-gray-600 font-medium text-sm">
                {studentId}
              </td>
              {attendanceData.dateStudentMap.map((entry) => (
                <td
                  key={`${entry.date}-${studentId}`}
                  className="px-6 py-4 text-center border-b border-gray-600"
                >
                  {entry.studentsPresent.includes(studentId) ? (
                    <span className="text-green-500 font-bold">✔</span>
                  ) : (
                    <span className="text-red-500 font-bold">✘</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-gray-400 text-sm">
        Total Classes Conducted: {attendanceData.totalClasses}
      </div>
    </div>
  );
}