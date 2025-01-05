"use client";
import { useEffect, useState } from "react";
import { useModel } from "../../../hooks/user-model-store";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import StudentCard from "../../../components/student/studentCard";
import mongoose from "mongoose";
import DotsLoader from "../../../components/loading/dotLoader";

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

  async function handleInterested() {
    if (!event) {
      return;
    }

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
    <div className="flex flex-col items-center w-full h-screen bg-[#181717] text-gray-400">
      {/* Event Header */}
      <div className="flex flex-col sm:flex-row items-center w-full sm:w-4/5 h-1/3 mt-12 justify-between">
        <div className="flex flex-col w-full sm:w-3/5 h-full">
          <div className="flex flex-row items-center justify-between">
            <div className="text-3xl font-bold text-gray-200">{event?.heading}</div>
            <button
              className={`text-lg font-bold px-6 py-2 rounded-md transition ${
                interested
                  ? "bg-gradient-to-br from-cyan-800 to-blue-800"
                  : "bg-gradient-to-br from-red-600 to-red-500"
              } text-white`}
              onClick={handleInterested}
            >
              {interested ? "Interested" : "Not Interested"}
            </button>
          </div>
          <div className="text-xl font-bold text-gray-300 mt-3 mb-2">Description</div>
          <div className="p-4 bg-[#1E1E1E] border border-blue-800 rounded-md shadow-lg">
            {event?.description}
          </div>
        </div>
        <img
          src={event?.poster}
          className="w-full sm:w-1/3 h-full object-cover rounded-md shadow-md border border-blue-800"
          alt="Event Poster"
        />
      </div>

      {/* Event Details */}
      <div className="flex flex-col sm:flex-row w-full sm:w-4/5 h-3/5 mt-10 justify-between">
        <div className="flex flex-col w-full sm:w-3/5 h-full">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="flex flex-col w-full sm:w-1/2 p-4 bg-[#1E1E1E] border border-blue-800 rounded-md shadow-lg">
              <div>
                <strong>Venue:</strong> <span>{event?.eventVenue}</span>
              </div>
              <div>
                <strong>Date:</strong>{" "}
                <span>{new Date(event?.eventTime).toLocaleString()}</span>
              </div>
              <div>
                <strong>Hosted By:</strong> <span>{event?.eventHostedBy}</span>
              </div>
            </div>
            <div className="flex flex-col w-full sm:w-1/3 p-4 bg-[#1E1E1E] border border-blue-800 rounded-md shadow-lg mt-4 sm:mt-0">
              <div className="text-xl font-bold text-gray-300 mb-2">Tags</div>
              {event?.tags.map((tag) => (
                <div key={tag} className="mt-1">
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-full mt-4 p-4 bg-[#1E1E1E] border border-blue-900 rounded-md shadow-lg">
            <div className="text-xl font-bold text-gray-300 mb-2">Attachments</div>
            {/* Attachments go here */}
          </div>
        </div>
        <div className="flex flex-col w-full sm:w-1/3 h-4/5 p-4 overflow-y-auto bg-[#1E1E1E] border border-blue-800 rounded-md shadow-lg">
          <div className="text-xl font-bold text-gray-300 mb-4">Interested People</div>
          {interestedMembers.map((member) => (
            <StudentCard
              key={member.student_id}
              name={member.name}
              student_id={member.student_id}
              profile={member.profile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
