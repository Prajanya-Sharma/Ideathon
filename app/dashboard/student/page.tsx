'use client'
import React, { useEffect } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useModel } from '../../../hooks/user-model-store';
import DotsLoader from "../../../components/loading/dotLoader";
import { FaBook, FaIdCard, FaGraduationCap, FaSchool } from "react-icons/fa";



const Student = () => {
  const { profile, setProfile, setLoading } = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`);
        if (res.status === 200) {
          setProfile(res.data.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setProfile, setLoading]);

  if (!profile) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-10 px-4">
      <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        {/* Student Details Section */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-6">
            <img
              src={profile.profile}
              width={120}
              height={120}
              className="rounded-full shadow-lg border-4 border-blue-500"
            />
            <div>
              <h1 className="text-4xl font-bold text-blue-400">{profile.name}</h1>
              <div className="mt-2 text-gray-300 space-y-1">
                <div className="flex items-center space-x-2">
                  <FaIdCard className="text-yellow-400" />
                  <p>Student ID: {profile.student_id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FaGraduationCap className="text-green-400" />
                  <p>Branch: {profile.branch}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FaSchool className="text-pink-400" />
                  <p>Semester: {profile.semester}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Marks Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
            Subject Marks
          </h2>
          <div className="space-y-6">
            {profile.subjectMarks.map((subject, index) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-lg shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-blue-300">
                    {subject.subjectId}
                  </h3>
                  <FaBook className="text-2xl text-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {subject.allMarks.map((mark, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md"
                    >
                      <span className="text-sm font-medium text-gray-300">
                        {mark.examType}:
                      </span>
                      <span className="text-sm font-bold text-gray-200">
                        {mark.marks} Marks
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clubs Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-green-400 mb-6">Clubs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.clubsPartOf.map((club) => (
              <div
                key={club._id.toString()}
                className="bg-gray-900 p-4 rounded-lg shadow-lg flex items-center space-x-4"
              >
                <img
                  src={club.clubLogo}
                  alt={club.clubName}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-blue-300">
                    {club.clubName}
                  </h3>
                  <button
                    className="mt-2 text-sm text-white bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-lg"
                    onClick={() => {
                      router.push(`/clubs/${club._id.toString()}`);
                    }}
                  >
                    Show Club Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student;