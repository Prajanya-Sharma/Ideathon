"use client";

import { useState } from "react";
import axios from "axios";
import {useRouter} from "next/navigation";

export default function AddAnnouncement() {
  const [announcementText, setAnnouncementText] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const departments = ["Computer Science", "Electrical", "Mechanical", "Civil", "Electronics"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/announcements`, {
        announcementText,
        department,
      });

      if (res.status === 200) {
        setMessage("Announcement added successfully!");
        setAnnouncementText("");
        setDepartment("");
      } else {
        setMessage("Failed to add announcements.");
      }
    } catch (error) {
      setMessage("Error occurred while adding the announcements.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="w-full py-8 bg-gray-950 shadow-lg flex justify-center items-center space-x-4">
        <h1 className="text-3xl font-extrabold text-blue-500 text-center">Add Announcement</h1>
        <button
          onClick={() => router.push("/admin/announcements")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
        >
          View All Announcements
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
              htmlFor="department"
              className="block text-sm font-medium text-gray-300"
            >
              Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="mt-2 w-full px-3 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select a department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
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
            {isLoading ? "Adding..." : "Add Announcement"}
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
