"use client";

import {useEffect, useState} from "react";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import DotsLoader from "@/components/loading/dotLoader";

export default function TeacherAddAnnouncement() {
  const [announcementText, setAnnouncementText] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [subjects, setSubjects] = useState<{subject_name: string, subject_code: string}[]>([]);
  const router = useRouter();
  const params = useParams();
  const id = params.id?.[0];


  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/subjects`);
        const res2  = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/announcements/${id}`);

        if (res.status === 200 && res2.status === 200) {
          setSubjects(res.data.subjectTeaching);
          setAnnouncementText(res2.data.announcementText);
          setSubjectCode(res2.data.subjectCode);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, router, setSubjects]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/announcements/${id}`,
        {
          announcementText,
          subjectCode,
        }
      );

      if (res.status === 200) {
        setMessage("Announcement updated successfully!");
        setTimeout(() => router.push("/teacher/announcements"), 2000);
      } else {
        setMessage("Failed to add announcement.");
      }
    } catch (error) {
      setMessage("Error occurred while adding the announcement.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DotsLoader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-8 bg-gray-950 shadow-lg flex justify-center items-center space-x-4">
        <h1 className="text-3xl font-extrabold text-blue-500 text-center">edit Class Announcement</h1>
        <button
          onClick={() => router.push("/teacher/announcements")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
        >
          My Announcements
        </button>
      </div>


      <div className="flex justify-center mt-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-xl w-full space-y-6"
        >
          <div>
            <label
              htmlFor="announcementText"
              className="block text-sm font-medium text-gray-300"
            >
              Announcement Text
            </label>
            <textarea
              id="announcementText"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              required
              rows={4}
              className="mt-2 w-full px-3 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter announcement details"
            />
          </div>

          <div>
            <label
              htmlFor="subjectCode"
              className="block text-sm font-medium text-gray-300"
            >
              Subject Code
            </label>
            <select
              id="subjectCode"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              required
              className="mt-2 w-full px-3 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a subject code
              </option>
              {subjects.map((subject) => (
                <option key={subject.subject_code} value={subject.subject_code}>
                  {subject.subject_code}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium text-white ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {isLoading ? "Updating..." : "Update Announcement"}
          </button>

          {message && (
            <div
              className={`mt-4 text-sm font-medium text-center ${
                message.includes("successfully") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
