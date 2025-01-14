//show all study requests
"use client";

import { useEffect } from "react";
import axios from "axios";
import DotsLoader from "../../components/loading/dotLoader";
import {useModel} from "@/hooks/user-model-store";
import {useRouter} from "next/navigation";

export default function StudyRequestsPage() {
  const { isLoading, setLoading, studyRequests, setStudyRequests} = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchStudyRequests() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests`);
        if (res.status === 200) {
          setStudyRequests(res.data);
        } else {
          console.error("Failed to fetch study requests");
        }
      } catch (error) {
        router.push("/");
        console.error("Error fetching study requests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudyRequests();
  }, [router, setLoading, setStudyRequests]);

  if (isLoading) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-8 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
          Study Requests
        </h1>
      </div>

      {/* Study Requests List */}
      <div className="flex flex-col items-center mt-10 px-4">
        {studyRequests?.length === 0 ? (
          <div className="text-gray-400 text-lg mt-20">
            No study requests available at the moment.
          </div>
        ) : (
          <div className="w-full max-w-5xl max-h-[70vh]">
            {studyRequests.map((request) => (
              <div
                key={request._id.toString()}
                className="flex flex-col bg-gray-800 rounded-lg shadow-xl p-6 my-4 hover:scale-105 transform transition-transform duration-300"
              >
                {/* User Info */}
                <div className="flex items-center mb-4">
                  <img
                    src={request.user_id.profile}
                    alt="User Profile"
                    className="w-12 h-12 rounded-full border-2 border-gray-700"
                  />
                  <div className="ml-4">
                    <div className="text-white font-bold text-lg">
                      {request.user_id.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {request.user_id.branch} - Semester {request.user_id.semester}
                    </div>
                    <div className="text-sm text-gray-500">
                      Student ID: {request.user_id.student_id}
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="text-lg font-semibold text-white">
                  {request.subjectName}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  {request.description}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Subject ID: {request.subjectId}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Price: <span className="text-blue-500">₹{request.price}</span>
                </div>

                {/* Attachments */}
                {request.attachments.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm text-gray-300 font-semibold">
                      Attachments:
                    </h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {request.attachments.map((attachment, index) => (
                        <li key={index}>
                          <a
                            href={attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Attachment {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Applications */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-white font-bold text-lg">
                    {request.applied.length} Applications
                  </div>
                  <button
                    disabled={request.isApplied}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={()=> router.push(`/study-requests/add-request-to-teach/${request._id.toString()}`)}
                  >
                    {request.isApplied ? "Applied" : "Apply Now"}
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
