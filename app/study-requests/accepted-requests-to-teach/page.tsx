"use client";
import io, { Socket } from "socket.io-client";
import { useEffect } from "react";
import axios from "axios";
import DotsLoader from "../../../components/loading/dotLoader";
import { useRouter } from "next/navigation";
import { useModel } from "@/hooks/user-model-store";

let socket: typeof Socket;

export default function AcceptedRequestsToTeachPage() {
  const { isLoading, setLoading, acceptedRequestsToTeach, setAcceptedRequestsToTeach } = useModel();
  const router = useRouter();

  useEffect(() => {
    socket = io("http://localhost:4000", {
      allowEIO3: true,
    });
  }, []);

  useEffect(() => {
    async function fetchAcceptedRequestsToTeach() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/accepted-requests-to-teach`
        );
        if (res.status === 200) {
          setAcceptedRequestsToTeach(res.data);
        } else {
          console.error("Failed to fetch accepted requests to teach");
        }
      } catch (error) {
        console.error("Error fetching accepted requests to teach:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAcceptedRequestsToTeach();
  }, [setAcceptedRequestsToTeach, setLoading]);

  const handleCancelMeeting = async (requestId: string) => {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/accepted-requests-to-teach/${requestId}`
      );
      if (res.status === 200) {
        setAcceptedRequestsToTeach(
          acceptedRequestsToTeach.filter((request) => request._id.toString() !== requestId)
        );
      } else {
        console.error("Failed to cancel the meeting");
      }
    } catch (error) {
      console.error("Error canceling the meeting:", error);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    socket.emit("join-room", roomId);
    router.push(`/study-room/${roomId}`);
  };

  if (isLoading) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-8 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-blue-500 text-center">
          Accepted Requests to Teach
        </h1>
      </div>

      {/* Accepted Requests List */}
      <div className="flex flex-col items-center mt-10 px-4">
        {acceptedRequestsToTeach.length === 0 ? (
          <div className="text-gray-400 text-lg">No accepted requests to teach found.</div>
        ) : (
          <div className="w-full max-w-5xl space-y-6">
            {acceptedRequestsToTeach.map((request) => (
              <div
                key={request._id.toString()}
                className="bg-gray-800 rounded-lg shadow-xl p-6"
              >
                <div className="text-lg font-semibold text-white">
                  Student: {request.student.name} ({request.student.student_id})
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Semester: {request.student.semester}, Branch: {request.student.branch}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Subject:{" "}
                  <span className="font-semibold text-white">{request.subjectName}</span>
                </p>
                <p className="text-sm text-gray-400 mt-2">{request.description}</p>

                {/* Attachments */}
                {request.studentAttachments.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm text-gray-300 font-semibold">
                      Student Attachments:
                    </h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {request.studentAttachments.map((attachment, index) => (
                        <li key={index}>
                          <a
                            href={attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {attachment}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {request.teacherAttachments.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm text-gray-300 font-semibold">
                      Teacher Attachments:
                    </h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {request.teacherAttachments.map((attachment, index) => (
                        <li key={index}>
                          <a
                            href={attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {attachment}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  Student&#39;s Phone:{" "}
                  <span className="font-semibold text-white">{request.studentPhoneNumber}</span>
                </p>

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => handleCancelMeeting(request._id.toString())}
                  >
                    Cancel Meeting
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => handleJoinRoom(request.roomId)}
                  >
                    Join Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
