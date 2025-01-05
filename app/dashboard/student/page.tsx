'use client'
import React, { useEffect, useState } from 'react';
import ClubCard from "../../../components/club/clubCard";
import MarksCard from "../../../components/student/marksCard";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useModel } from '../../../hooks/user-model-store';
import DotsLoader from "../../../components/loading/dotLoader";

const Student = () => {
  const { profile, setProfile, setLoading } = useModel();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    <div className="flex flex-col items-center justify-start w-full bg-gradient-to-b from-[#0B0C10] to-[#1F2833] p-10 relative">
      {/* Navigation Button and Dropdown Menu */}
      <div className="absolute top-3 right-4" >
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-gradient-to-r from-[#66FCF1] to-[#45A29E] text-black rounded-sm shadow-lg transform mb-3 px-3 hover:scale-105 transition-transform duration-300 ease-in-out h-15"
        >
         Navigate
          
        </button>
        {dropdownOpen && (
          <div className="absolute top-14 right-0 w-48 bg-[#0B0C10] border border-cyan-300 rounded-lg shadow-md">
            <ul className="space-y-2 p-2">
              <li className="text-[#66FCF1] hover:text-white cursor-pointer">Events</li>
              <li className="text-[#66FCF1] hover:text-white cursor-pointer">Map</li>
              <li className="text-[#66FCF1] hover:text-white cursor-pointer">Clubs</li>
            </ul>
          </div>
        )}
      </div>

      <div className="text-2xl font-bold text-[#66FCF1] mb-1 text-center">
        Student Profile
      </div>

      {/* Student Profile Section */}
      <div
        className="flex flex-col md:flex-row items-center w-full max-w-screen-sm bg-[#0B0C10] border-2 rounded-lg border-cyan-300 shadow-md shadow-cyan-300/50 p-3 mb-6 space-y-10 md:space-y-5 md:space-x-5
        h-fit overflow-hidden"
      >
        <div className="flex flex-col w-full md:w-2/3 space-y-2">
          {[
            { label: "Name", value: profile.name },
            { label: "SID", value: profile.student_id },
            { label: "Branch", value: profile.branch },
            { label: "Semester", value: profile.semester },
          ].map((field, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-1 text-sm font-semibold text-white border-b border-cyan-500"
            >
              <div className="w-1/3 text-[#66FCF1]">
                {field.label}
              </div>
              <div className="w-2/3 text-right">
                {field.value}
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex items-center justify-center w-20 h-20 md:w-1/4 md:h-24 border-2 rounded-full border-cyan-300 shadow-md shadow-cyan-300/50 overflow-hidden"
        >
          <img
            src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Joined Clubs Section */}
      <div className="w-full max-w-screen-sm text-lg font-bold mt-6 text-[#66FCF1] text-center">
        Joined Clubs
      </div>
      <div
        className="flex flex-col md:flex-row w-full max-w-screen-sm bg-[#0B0C10] border-4 rounded-lg border-cyan-300 shadow-md shadow-cyan-300/50 p-3 mb-6 space-y-4 md:space-y-0 md:space-x-4
        min-h-[17rem]"
      >
        <div className="flex flex-col w-full md:w-3/4 space-y-2 overflow-y-auto">
          {profile.clubsPartOf.map((club) => (
            <ClubCard key={club._id as any} clubName={club.clubName} clubLogo={club.clubLogo} />
          ))}
        </div>
        <div className="flex flex-col items-center w-full md:w-1/4 space-y-2">
          <div className="text-base font-bold text-white">
            Number of Clubs joined:
          </div>
          <div className="text-xl font-bold text-[#66FCF1]">
            {profile.clubsPartOf.length}
          </div>
        </div>
      </div>

      {/* Marks Section */}
      <div className="w-full max-w-screen-sm text-lg font-bold mt-6 text-[#66FCF1] text-center">
        Marks
      </div>
      <div
        className="flex flex-col w-full max-w-screen-sm bg-[#0B0C10] border-4 rounded-lg border-cyan-300 shadow-md shadow-cyan-300/50 p-3 space-y-2 overflow-y-auto
        max-h-[14rem]"
      >
        <MarksCard subjectMarks={profile.subjectMarks as any} />
      </div>
    </div>
  );
};

export default Student;
