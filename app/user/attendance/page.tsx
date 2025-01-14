"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FaCalendarCheck } from "react-icons/fa";

const StudentAttendancePage = () => {
  const { data: session } = useSession();
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/api/user/attendance");
        setAttendances(response.data);
      } catch (error) {
        console.error("Error fetching attendance", error);
        alert("Error fetching attendance.");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchAttendance();
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">View Attendance</h1>
      {loading && (
        <div className="text-center text-lg font-semibold mt-4">
          <span>Loading attendance...</span>
        </div>
      )}

      {attendances.length > 0 && !loading ? (
        <div className="space-y-6 max-w-3xl mx-auto">
          {attendances.map((attendance: any, index: number) => {
            const datesPresent = attendance.dateStudentMap.length;
            const attendancePercentage = (
              (datesPresent / attendance.totalClasses) *
              100
            ).toFixed(2);

            return (
              <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-blue-300">
                    {attendance.subjectId} - {attendance.groupName}
                  </h3>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-medium text-gray-300">
                    Total Classes: {attendance.totalClasses}
                  </span>
                  <span className="text-sm font-medium text-gray-300">
                    Attendance Percentage: {attendancePercentage}%
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    {attendance.dateStudentMap.map((dateEntry: any, idx: number) => (
                      <div key={idx} className="bg-gray-700 p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-300">
                            Date: {dateEntry.date}
                          </span>
                          <span className="text-sm font-medium text-gray-300">
                            Lectures: {dateEntry.lectureCount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <div className="text-center text-lg font-semibold mt-4">
            <span>No attendance data found.</span>
          </div>
        )
      )}
    </div>
  );
};

export default StudentAttendancePage;
