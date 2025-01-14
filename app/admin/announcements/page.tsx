"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DotsLoader from "../../../components/loading/dotLoader";
import mongoose from "mongoose";
import {useRouter} from "next/navigation";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<{_id:mongoose.Types.ObjectId, announcementText: string, department: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchAnnouncements() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/announcements`
        );
        if (res.status === 200) {
          setAnnouncements(res.data);
        } else {
          console.error("Failed to fetch announcements");
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    setMessage("");
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/announcements/${id}`
      );
      if (res.status === 200) {
        setAnnouncements((prev) => prev.filter((ann) => ann._id.toString() !== id));
        setMessage("Announcement deleted successfully!");
      } else {
        setMessage("Failed to delete announcements.");
      }
    } catch (error) {
      console.error("Error deleting announcements:", error);
      setMessage("Error deleting announcements.");
    } finally {
      setIsLoading(false);
      setTimeout(()=> setMessage(""), 5000)
    }
  };

  if (isLoading) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-8 bg-gray-950 shadow-lg flex justify-center items-center space-x-4">
        <h1 className="text-3xl font-extrabold text-blue-500 text-center">All Announcement</h1>
        <button
          onClick={() => router.push("/admin/announcements/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
        >
          Add Announcements
        </button>
      </div>

      <div className="flex flex-col items-center mt-10 px-4">
        {message && (
          <div
            className={`mb-6 text-sm font-medium text-center ${
              message.includes("successfully") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}

        {announcements.length === 0 ? (
          <div className="text-gray-400 text-lg">No announcements found.</div>
        ) : (
          <div className="w-full max-w-5xl space-y-6">
            {announcements.map((announcement) => (
              <div
                key={announcement._id.toString()}
                className="bg-gray-800 rounded-lg shadow-xl p-6"
              >
                <div className="text-lg font-semibold text-white">
                  Announcement for {announcement.department}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {announcement.announcementText}
                </p>

                {/* Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => handleDelete(announcement._id.toString())}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() =>
                      router.push(`/admin/announcements/edit/${announcement._id.toString()}`)
                    }
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
