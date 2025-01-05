'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TeacherDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subjectName, setSubjectName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  if (status === "loading") {
    return (
      <div className="bg-gradient-to-b from-blue-900 to-black h-screen flex justify-center items-center text-white">
        <div>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gradient-to-b from-blue-900 to-black h-screen flex justify-center items-center text-white">
        <div>Please sign in</div>
      </div>
    );
  }

  const { user } = session;

  if (!user.isTeacher) {
    return (
      <div className="bg-gradient-to-b from-blue-900 to-black h-screen flex justify-center items-center text-white">
        <div>Access Denied. Only teachers are allowed here.</div>
      </div>
    );
  }

  const handleAddSubject = () => {
    console.log("Subject Added:", { subjectName, subjectId });
    setSubjectName("");
    setSubjectId("");
  };

  const handleSubjectUpdate = () => {
    if (selectedSubject) {
      router.push("http://localhost:3000/dashboard/teacher/selectedSubject");
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-800 to-black min-h-screen p-6 text-white font-sans transition-all duration-300">
      <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text absolute top-5 left-5 transition-all duration-300">
        Welcome, {user.username}
      </h1>

      <div className="mt-32 flex gap-6 justify-center">
        {/* Add Subject Card */}
        <div className="max-w-md w-full p-6 rounded-xl bg-black bg-opacity-60 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Add New Subject</h2>

          <div className="mb-4">
            <label htmlFor="subjectName" className="block text-gray-400 text-sm mb-2">
              Add Subject Name:
            </label>
            <input
              id="subjectName"
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter subject name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="subjectId" className="block text-gray-400 text-sm mb-2">
              Add Subject ID:
            </label>
            <input
              id="subjectId"
              type="text"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter subject ID"
            />
          </div>

          <button
            onClick={handleAddSubject}
            className="w-full p-3 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Add Subject
          </button>
        </div>

        {/* Choose Subject Card */}
        <div className="max-w-md w-full p-6 rounded-xl bg-black bg-opacity-60 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Choose Subject to Update</h2>

          <div className="mb-4">
            <label htmlFor="chooseSubject" className="block text-gray-400 text-sm mb-2">
              Select Subject:
            </label>
            <select
              id="chooseSubject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="" disabled className="bg-gray-800 text-gray-400">
                Select a subject
              </option>
              <option value="subject-1" className="bg-gray-800 text-white">
                Subject 1 (ID: subject-1)
              </option>
              <option value="subject-2" className="bg-gray-800 text-white">
                Subject 2 (ID: subject-2)
              </option>
              <option value="subject-3" className="bg-gray-800 text-white">
                Subject 3 (ID: subject-3)
              </option>
            </select>
          </div>

          <button
            onClick={handleSubjectUpdate}
            className="w-full p-3 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={!selectedSubject}
          >
            Go to Subject
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;