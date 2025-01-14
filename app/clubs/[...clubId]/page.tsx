"use client"

import SmallEventCard from "../../../components/events/smallCard";
import { redirect, useParams } from "next/navigation";
import { useModel } from "../../../hooks/user-model-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import DotsLoader from "../../../components/loading/dotLoader";
import { useSession } from "next-auth/react";
import StudentCard from "@/components/student/studentCard";
import HeadCard from "@/components/student/headCard";

export default function Club() {
  const { singleClub, setSingleClub, isLoading, setLoading } = useModel();
  const router = useRouter();
  const params = useParams();
  const clubId = params.clubId?.[0];
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clubs/${clubId}`);
        if (res.status === 200) {
          setSingleClub(res.data.data);
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
  }, [setSingleClub, setLoading, clubId, router]);

  if (!singleClub || isLoading) {
    return <DotsLoader />;
  }

  const isSecy = singleClub.clubIdSecs.some(secy => secy.user_id === session?.user?._id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1F2833] to-[#0B0C10] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="relative bg-[#1F2833] rounded-2xl p-8 shadow-2xl border border-[#1F2833] mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Club Info */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-[#3f9fff] mb-2 tracking-wider">
                  {singleClub.clubName}
                </h1>
                <div className="h-1 w-32 bg-[#1F2833] rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#C5C6C7] flex items-center gap-2">
                  Club Secretaries
                  <div className="h-px flex-1 bg-[#1F2833] ml-4 opacity-50"></div>
                </h2>
                <div className="grid gap-4">
                  {singleClub.clubIdSecs.map((secy) => (
                    <div key={secy.student_id} className="transform hover:scale-105 transition-all duration-300">
                      <HeadCard
                        name={secy.name}
                        student_id={secy.student_id}
                        profile={secy.profile}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Club Logo */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1F2833] to-[#364F6B] rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={singleClub.clubLogo || "https://india.acm.org/images/acm_rgb_grad_pos_diamond.png"}
                alt="Club Logo"
                className="relative h-64 w-64 object-cover rounded-full border-4 border-[#1F2833] shadow-xl transform transition duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Events Section */}
          <div className="md:col-span-2">
            <div className="bg-[#1F2833] rounded-2xl p-6 border border-[#1F2833] shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-[#C5C6C7]">Events</h2>
                <button
                  onClick={() => redirect("/events")}
                  className="px-6 py-3 bg-gradient-to-r from-[#1F2833] to-[#364F6B] text-[#C5C6C7] rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Show All Events
                </button>
              </div>
              <div className="h-[600px] overflow-y-auto pr-4 space-y-4 scrollbar-thin scrollbar-thumb-[#364F6B] scrollbar-track-[#1F2833]">
                {singleClub.clubEvents.map((event) => (
                  <div key={event._id.toString()} className="transform hover:scale-102 transition-all duration-300">
                    <SmallEventCard
                      heading={event.heading}
                      isInterested={event.isInterested}
                      eventTime={event.eventTime}
                      eventVenue={event.eventVenue}
                      _id={event._id.toString()}
                      isSecy={isSecy}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div className="bg-[#1F2833] rounded-2xl p-6 border border-[#1F2833] shadow-xl">
            <h2 className="text-3xl font-bold text-[#C5C6C7] mb-6 text-center">Members</h2>
            <div className="h-[600px] overflow-y-auto pr-4 space-y-4 scrollbar-thin scrollbar-thumb-[#364F6B] scrollbar-track-[#1F2833]">
              {singleClub.clubMembers.map((member) => (
                <div key={member.student_id} className="transform hover:scale-102 transition-all duration-300">
                  <StudentCard
                    name={member.name}
                    student_id={member.student_id}
                    profile={member.profile}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}