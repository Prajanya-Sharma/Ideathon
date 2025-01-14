"use client";
import { useEffect, useState } from "react";
import { useModel } from "../../../hooks/user-model-store";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import StudentCard from "../../../components/student/studentCard";
import mongoose from "mongoose";
import DotsLoader from "../../../components/loading/dotLoader";
import { motion } from "framer-motion";

interface InterestedMembers {
  _id: mongoose.Types.ObjectId;
  name: string;
  profile: string;
  student_id: string;
}

export default function Event() {
  const [interested, setInterested] = useState<boolean>(false);
  const [interestedMembers, setInterestedMembers] = useState<InterestedMembers[]>([]);
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId?.[0];
  const { singleEvent, setSingleEvent, setLoading } = useModel();

  useEffect(() => {
    if (!eventId) return;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${eventId}`);
        if (res.status === 200) {
          setSingleEvent(res.data.data);
          setInterested(res.data.data.isInterested);
          setInterestedMembers(res.data.data.interestedMembersArr);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [eventId, setSingleEvent, setLoading, router]);

  if (!singleEvent) {
    return <DotsLoader />;
  }

  const event = singleEvent;

  const formatDescription = (description: string) => {
    return description.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  async function handleInterested() {
    if (!event) return;

    const { _id } = event;
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/interested/${_id.toString()}`);
      if (res.status === 200) {
        if (!interested) {
          setInterestedMembers((prev) => [...prev, res.data.studentInfo]);
        } else {
          setInterestedMembers((prev) =>
            prev.filter((item) => item._id.toString() !== res.data.studentInfo._id.toString())
          );
        }
        setInterested((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#181717] text-gray-300 pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12"
      >
        {/* Event Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4 sm:mb-0">
                {event?.heading}
              </h1>
              <button
                className={`transform hover:scale-105 transition-all duration-300 px-6 py-2 rounded-lg font-semibold ${
                  interested
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25"
                }`}
                onClick={handleInterested}
              >
                {interested ? "Interested" : "Not Interested"}
              </button>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-blue-900/30 shadow-xl backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-3 text-blue-400">Description</h2>
              <p className="leading-relaxed whitespace-pre-line">
                {formatDescription(event?.description)}
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:w-1/3 h-full"
          >
            <div className="h-full min-h-[400px]">
              <img
                src={event?.poster}
                className="w-full h-full object-cover rounded-xl shadow-2xl border border-blue-900/30 transform hover:scale-[1.02] transition-transform duration-300"
                alt="Event Poster"
              />
            </div>
          </motion.div>
        </div>

        {/* Event Details */}
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-blue-900/30 shadow-xl backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-4 text-blue-400">Event Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-400">Venue:</span>
                    <span>{event.eventVenue}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-400">Date:</span>
                    <span>{new Date(event?.eventTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-400">Hosted By:</span>
                    <span>{event?.eventHostedBy}</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-blue-900/30 shadow-xl backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-4 text-blue-400">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event?.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-900/20 rounded-full text-sm font-medium text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-blue-900/30 shadow-xl backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">Attachments</h2>
              {/* Attachments content */}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:w-1/3"
          >
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-blue-900/30 shadow-xl backdrop-blur-sm h-[600px] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-6 text-blue-400 sticky top-0 bg-[#1a1a1a] py-2">
                Interested People
              </h2>
              <div className="space-y-4">
                {interestedMembers.map((member) => (
                  <div key={member.student_id} className="transform hover:scale-[1.02] transition-transform duration-300">
                    <StudentCard
                      name={member.name}
                      student_id={member.student_id}
                      profile={member.profile}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}