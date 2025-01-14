"use client";

import {useEffect, useState} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DotsLoader from "../../../components/loading/dotLoader";
import { FaBook, FaIdCard } from "react-icons/fa";
import mongoose from "mongoose";

const Teacher = () => {
  const [isLoading, setLoading]  = useState(true);
  const [profile, setProfile] = useState<{_id: mongoose.Types.ObjectId, user_id: mongoose.Types.ObjectId, teacher_id: string, subjectTeaching: {
      subject_code: string;
      subject_name: string;
    }[]}| null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/profile`);
        if (res.status === 200) {
          setProfile(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setProfile, setLoading, router]);

  if (!profile || isLoading) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-10 px-4">
      <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        {/* Teacher Profile Section */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-4xl font-bold text-blue-400">Teacher Profile</h1>
              <div className="mt-2 text-gray-300 space-y-1">
                <div className="flex items-center space-x-2">
                  <FaIdCard className="text-yellow-400" />
                  <p>Teacher ID: {profile.teacher_id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teaching Subjects Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-6">Subjects Taught</h2>
          <div className="space-y-6">
            {profile.subjectTeaching.map((subject, index) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-lg shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-blue-300">
                    {subject.subject_name}
                  </h3>
                  <FaBook className="text-2xl text-blue-500" />
                </div>
                <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md">
                  <span className="text-sm font-medium text-gray-300">
                    Subject Code:
                  </span>
                  <span className="text-sm font-bold text-gray-200">
                    {subject.subject_code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
