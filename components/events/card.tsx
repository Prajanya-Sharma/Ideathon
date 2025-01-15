"use client";
import axios from "axios";
import Tag from "./tag";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EventCardProps {
  _id: string;
  poster: string;
  heading: string;
  eventHostedBy: string;
  description: string;
  tags: string[];
  eventTime: Date;
  eventVenue: string;
  isInterested: boolean;
  activeTab: string;  // Add this prop
}

export default function EventCard({
  _id,
  poster,
  heading,
  eventHostedBy,
  description,
  tags,
  eventTime,
  eventVenue,
  isInterested,
  activeTab,  // Add this
}: EventCardProps) {
  const [interested, setInterested] = useState(isInterested);

  const formatDescription = (description: string) => {
    return description.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };
  async function handleInterested() {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/interested/${_id}`
      );
      if (res.status === 200) {
        setInterested(!interested);
        // Refresh the page while maintaining the active tab
        window.location.href = `/events?tab=${activeTab}`;
      }
    } catch (error) {
      console.log("Error updating interest status:", error);
    }
  }

  // async function handleInterested() {
  //   try {
  //     const res = await axios.patch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/interested/${_id}`
  //     );
  //     if (res.status === 200) {
  //       console.log("Interest status updated");
  //       setInterested(!interested);
  //     }
  //   } catch (error) {
  //     console.log("Error updating interest status:", error);
  //   }
  // }

  const router = useRouter();
  return (
    <div className="flex flex-col sm:flex-row w-full max-w-full mt-8 rounded-lg border-2 border-[#1E2A47] bg-gradient-to-br from-[#0B0C10] to-[#1F2833] shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
      {/* Image Section */}
      <div className="w-full sm:w-1/3 h-64 sm:h-[300px]">
        <img
          src={poster}
          alt="event poster"
          className="h-full w-full object-cover rounded-t-lg sm:rounded-l-lg"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between w-full sm:w-2/3 p-6 text-white">
        {/* Header Section */}
        <div>
          <div className="flex justify-between items-center">
            <h2
              className="text-2xl sm:text-3xl font-tracking-wide text-gray-400 hover:text-gray-200 transition-colors cursor-pointer font-archivo"
              onClick={() => router.push(`/events/${_id}`)}
            >
              {heading}
            </h2>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </div>

          {/* Description */}
          <div className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed max-h-24 sm:max-h-32 overflow-hidden hover:overflow-auto transition-all duration-300 whitespace-pre-line">
            {formatDescription(description)}
          </div>
        </div>

        {/* Time, Venue, and Hosted By */}
        <div className="mt-6">
          <p className="text-sm sm:text-base text-gray-400">
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
              Time:
            </span>{" "}
            {new Date(eventTime).toLocaleString()}
          </p>
          <p className="text-sm sm:text-base text-gray-400">
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
              Venue:
            </span>{" "}
            {eventVenue}
          </p>
          <p className="text-sm sm:text-base text-gray-400">
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
              Hosted By:
            </span>{" "}
            {eventHostedBy}
          </p>
        </div>

        {/* Interested Button */}
        <button
          className={`mt-6 px-4 py-2 rounded-md font-medium sm:font-bold text-sm sm:text-base w-full sm:w-1/2 self-center transition-all duration-300 shadow-lg ${
            interested
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-emerald-500/25"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 hover:shadow-cyan-500/25"
          }`}
          onClick={handleInterested}
        >
          {interested ? "Interested" : "Not Interested"}
        </button>
      </div>
    </div>
  );
}