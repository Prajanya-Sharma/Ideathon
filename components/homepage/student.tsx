"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {useRouter} from "next/navigation";

export default function StudentHomePage() {
  const [adminAnnouncements, setAdminAnnouncements] = useState<{announcementText: string, department: string, createdAt: Date, updatedAt: Date}[]>([]);
  const [teacherAnnouncements, setTeacherAnnouncements] = useState<{announcementText: string, subjectCode: string, createdAt: Date, updatedAt: Date}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchAnnouncements() {
      setIsLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/announcements`);
        if (res.status === 200) {
          setAdminAnnouncements(res.data.adminAnnouncements);
          setTeacherAnnouncements(res.data.classAnnouncements);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Announcements Section */}
      <section className="max-w-7xl mx-auto pt-10 px-4 space-y-16">
        {/* Admin Announcements */}
        <div>
          <h2 className="text-4xl font-bold text-blue-400 mb-6">Admin Announcements</h2>
          {isLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : adminAnnouncements.length === 0 ? (
            <p className="text-gray-400">No announcements from the admin.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {adminAnnouncements.map((announcement, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-white">{announcement.department}</h3>
                  <p className="text-sm text-gray-300 mt-2">{announcement.announcementText}</p>
                  <p className="text-xs text-gray-500 mt-4">
                    Posted on: {moment(announcement.createdAt).format("MMMM Do YYYY, h:mm A")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Teacher Announcements */}
        <div>
          <h2 className="text-4xl font-bold text-green-400 mb-6">Teacher Announcements</h2>
          {isLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : teacherAnnouncements.length === 0 ? (
            <p className="text-gray-400">No announcements from teachers.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teacherAnnouncements.map((announcement, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-white">
                    Subject: {announcement.subjectCode}
                  </h3>
                  <p className="text-sm text-gray-300 mt-2">{announcement.announcementText}</p>
                  <p className="text-xs text-gray-400 mt-4">
                    Posted on: {moment(announcement.createdAt).format("MMMM Do YYYY, h:mm A")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Features Section */}
      <div className="py-16">
        <h2 className="text-4xl font-bold text-blue-400 text-center mb-12">
          Explore Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto">
          {/* Clubs */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">Clubs</h3>
            <p className="text-gray-300">
              Join clubs to connect with like-minded peers. Share ideas, collaborate
              on projects, and build your network.
            </p>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              onClick={() => router.push("/clubs")}
            >
              Explore Clubs
            </button>
          </div>

          {/* Events */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-emerald-400 mb-4">Events</h3>
            <p className="text-gray-300">
              Stay updated with all upcoming events and workshops happening across the
              campus.
            </p>
            <button
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg"
              onClick={() => router.push("/events")}
            >
              View Events
            </button>
          </div>

          {/* Dashboard */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Dashboard</h3>
            <p className="text-gray-300">
              Access your personal dashboard to view your marks, the clubs you are part of, and your profile details.
            </p>
            <button
              className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg"
              onClick={() => router.push("/dashboard/student")}
            >
              Open Dashboard
            </button>
          </div>

          {/* Attendance Tracker */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-orange-400 mb-4">Attendance Tracker</h3>
            <p className="text-gray-300">
              Keep track of your attendance records, review attendance percentages, and stay updated on your class participation.
            </p>
            <button
              className="mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg"
            >
              Track Attendance
            </button>
          </div>

          {/* Resources */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-purple-400 mb-4">Resources</h3>
            <p className="text-gray-300">
              Access study materials, previous question papers, and helpful guides
              curated by your professors.
            </p>
            <button
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
              onClick={() => router.push("/resources")}
            >
              Access Resources
            </button>
          </div>

          {/* Friends */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-pink-400 mb-4">Friends</h3>
            <p className="text-gray-300">
              Discover and connect with your classmates and peers. See their live
              location on campus.
            </p>
            <button
              className="mt-4 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg"
              onClick={() => router.push("/MAP")}
            >
              Find Friends
            </button>
          </div>

          {/* Study Together */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-emerald-400 mb-4">Study Together</h3>
            <p className="text-gray-300">
              Post study requests or teach others. Collaborate with fellow students
              to learn and grow together.
            </p>
            <button
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg"
              onClick={() => router.push("/study-requests")}
            >
              Study Together
            </button>
          </div>

          {/* Issues Page */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-rose-400 mb-4">Issues</h3>
            <p className="text-gray-300">
              Report campus-related issues like maintenance problems or academic
              concerns. Get timely resolutions.
            </p>
            <button
              className="mt-4 bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-lg"
              onClick={() => router.push("/issues")}
            >
              Report Issues
            </button>
          </div>

          {/* AI Chatbot */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">AI Chatbot</h3>
            <p className="text-gray-300">
              Ask the AI Chatbot anything about the college or retrieve specific information directly from our website.
            </p>
            <button className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg">
              Chat with AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
