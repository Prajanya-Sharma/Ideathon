"use client";

import { useState } from "react";
import axios from "axios";

export default function StudentsSubjectPage() {
  const [student_id, setStudentId] = useState<string>("");
  const [subject_id, setSubjectId] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  async function AddSubject() {
    if (student_id.length < 5) {
      setMessage("Student ID should have at least 5 digits");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/subjects/student`,
        { student_id, subject_id }
      );

      if (res.status === 200) {
        setMessage("Subject successfully added!");
      } else {
        setMessage("Failed to add subject!");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to add subject!");
    } finally {
      setTimeout(() => setMessage(""), 5000);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="py-8 w-full bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-500">Add Subject</h1>
      </div>

      {/* Form */}
      <div className="flex flex-col items-center mt-12 w-full max-w-md px-4">
        <input
          type="text"
          className="w-full h-12 rounded-lg pl-4 text-lg text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
          placeholder="Enter Student ID (First 5 digits)"
          value={student_id}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          type="text"
          className="w-full h-12 rounded-lg pl-4 text-lg text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
          placeholder="Enter Subject Code"
          value={subject_id}
          onChange={(e) => setSubjectId(e.target.value)}
        />
        <button
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition duration-300"
          onClick={AddSubject}
        >
          Add Subject
        </button>

        {/* Message */}
        {message && (
          <div
            className={`mt-6 text-center py-2 px-4 w-full rounded-lg ${
              message.includes("successfully")
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
