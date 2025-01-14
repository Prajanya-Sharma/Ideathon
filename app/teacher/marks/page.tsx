"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UploadMarksPage = () => {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("/api/teacher/subjects");
        setSubjects(response.data.subjectTeaching || []);
      } catch (error) {
        console.error("Error fetching subjects", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert("You must be logged in to perform this action.");
      return;
    }

    if (!file || !subjectId) {
      alert("Please select a subject and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subjectId", subjectId);

    setLoading(true);
    try {
      const response = await axios.patch(`/api/teacher/marks`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);
    } catch (error: any) {
      alert(error.response?.data?.error || "An error occurred while uploading the file.");
    } finally {
      setLoading(false);
      router.push('/teacher/marks/show-marks');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Upload Marks</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full p-1 text-sm border rounded bg-gray-700 text-white"
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

        <div>
          <label className="block text-sm font-medium mb-1">CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full p-1 text-sm border rounded bg-gray-700 text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Marks"}
        </button>
      </form>
    </div>
  );
};

export default UploadMarksPage;
