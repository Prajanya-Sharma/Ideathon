"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FaBook } from "react-icons/fa";

const TeacherMarksPage = () => {
  const { data: session } = useSession();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMarks = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/api/teacher/get-marks");
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching marks", error);
        alert("Error fetching marks.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, [session]);

  const handleSubjectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectCode = e.target.value;
    setSelectedSubject(subjectCode);

    if (subjectCode) {
      const selectedSubjectMarks = subjects.find(
        (subject) => subject.subject_name === subjectCode
      );
      setMarks(selectedSubjectMarks?.marks || []);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">View Marks</h1>

      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        {/* Subject Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Subject</label>
          <select
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="w-full p-2 text-sm border rounded bg-gray-700 text-white"
            required
          >
            <option value="" disabled>
              Select a subject
            </option>
            {subjects.map((subject: any, index: number) => (
              <option key={index} value={subject.subject_code}>
                {subject.subject_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Marks Section */}
      {selectedSubject && marks.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
            Subject Marks
          </h2>
          <div className="space-y-6">
            {marks.map((exam: any, index: number) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-lg shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-blue-300">
                    {exam.examType}
                  </h3>
                  <FaBook className="text-2xl text-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {exam.studentMarks.map((student: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md"
                    >
                      <span className="text-sm font-medium text-gray-300">
                        Student ID: {student.student_id}
                      </span>
                      <span className="text-sm font-bold text-gray-200">
                        {student.marks} Marks
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center text-lg font-semibold mt-4">
          <span>Loading marks...</span>
        </div>
      )}
    </div>
  );
};

export default TeacherMarksPage;
