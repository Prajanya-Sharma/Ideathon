import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Props {
  heading: string;
  isInterested: boolean;
  eventTime: Date;
  eventVenue: string;
  _id: string;
  isSecy: boolean;
}

export default function SmallEventCard({ heading, isInterested, eventTime, eventVenue, _id, isSecy }: Props) {
  const [interested, setInterested] = useState<boolean>(isInterested);
  const router = useRouter();

  async function handleInterested() {
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/interested/${_id}`);
      if (res.status === 200) {
        console.log("Interest status updated");
        setInterested(!interested);
      }
    } catch (error) {
      console.log("Error updating interest status:", error);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${_id}`);
      if (res.status === 200) {
        console.log("Event deleted");
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mt-8 bg-gray-800 rounded-lg shadow-xl p-6 hover:scale-105 transform transition-transform duration-300">
      {/* Heading and Interest Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-500 truncate">{heading}</h2>
        <button
          className={`text-lg font-bold py-2 px-6 rounded-lg transition-all duration-300 ${
            interested
              ? "bg-red-700 hover:bg-red-800 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          onClick={handleInterested}
        >
          {interested ? "Unmark Interest" : "Mark Interested"}
        </button>
      </div>

      {/* Event Details */}
      <div className="mt-4 text-gray-300">
        <p>
          <span className="font-semibold">Date:</span>{" "}
          {new Date(eventTime).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">Venue:</span> {eventVenue}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
          onClick={() => router.push(`/events/${_id}`)}
        >
          View Details
        </button>
        {isSecy && (
          <div className="flex space-x-4">
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
              onClick={() => router.push(`/events/edit-event/${_id}`)}
            >
              Edit
            </button>
            <button
              className="bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
