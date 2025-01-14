"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import mongoose from "mongoose";

export default function TeacherAnnouncements() {
  const [announcements, setAnnouncements] = useState<{_id: mongoose.Types.ObjectId, subjectCode: string, announcementText: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchAnnouncements() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/announcements`,
        );
        if (res.status === 200) {
          setAnnouncements(res.data);
        } else {
          setMessage("Failed to fetch announcements.");
        }
      } catch (error) {
        router.push("/");
        console.error("Error fetching announcements:", error);
        setMessage("Error occurred while fetching announcements.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnnouncements();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/announcements/${id}`);

      if (res.status === 200) {
        setAnnouncements((prev) =>
          prev.filter((announcement) => announcement._id.toString() !== id)
        );
        setMessage("Announcement deleted successfully.");
      } else {
        setMessage("Failed to delete announcement.");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      setMessage("Error occurred while deleting the announcement.");
    } finally {
      setTimeout(()=> setMessage(""), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="w-full py-8 bg-gray-950 shadow-lg flex justify-center items-center space-x-4">
        <h1 className="text-3xl font-extrabold text-blue-500 text-center">My Announcement</h1>
        <button
          onClick={() => router.push("/teacher/announcements/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
        >
          Add Announcements
        </button>
      </div>


      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-gray-300">Loading...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-gray-300">No announcements found.</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 mt-10">
          <table className="table-auto w-full text-left bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Announcement</th>
              <th className="py-3 px-4">Subject Code</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
            </thead>
            <tbody>
            {announcements.map((announcement, index) => (
              <tr
                key={announcement._id.toString()}
                className="border-t border-gray-700 hover:bg-gray-750"
              >
                <td className="py-3 px-4 text-gray-300">{index + 1}</td>
                <td className="py-3 px-4 text-gray-300">
                  {announcement.announcementText}
                </td>
                <td className="py-3 px-4 text-gray-300">
                  {announcement.subjectCode}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() =>
                      router.push(`/teacher/announcements/edit/${announcement._id.toString()}`)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg font-medium shadow-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(announcement._id.toString())}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg font-medium shadow-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}

      {message && (
        <div
          className={`text-center mt-6 text-sm font-medium ${
            message.includes("successfully")
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
