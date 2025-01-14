//request made by me to study

"use client";

import {useEffect, useState} from "react";
import axios from "axios";
import DotsLoader from "../../../components/loading/dotLoader";
import {useModel} from "@/hooks/user-model-store";
import {useRouter} from "next/navigation";

export default function StudyRequestsPage() {
  const { isLoading, setLoading, myRequests, setMyRequests} = useModel();
  const [deletePopup, setDeletePopup] = useState<{
    visible: boolean;
    requestId: string | null;
  }>({ visible: false, requestId: null });
  const router = useRouter();


  useEffect(() => {
    async function fetchStudyRequests() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/my-requests`);
        if (res.status === 200) {
          setMyRequests(res.data);
        } else {
          console.error("Failed to fetch study requests");
        }
      } catch (error) {
        router.push("/")
        console.error("Error fetching study requests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudyRequests();
  }, [router, setLoading, setMyRequests]);

  const handleDelete = async () => {
    if (!deletePopup.requestId) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/my-requests/${deletePopup.requestId}`
      );
      if (res.status === 200) {
        alert("Request deleted successfully!");
        setMyRequests(myRequests.filter((req) => req._id.toString() !== deletePopup.requestId));
      } else {
        alert("Failed to delete request. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("An error occurred while deleting the request.");
    } finally {
      setDeletePopup({ visible: false, requestId: null });
    }
  };


  if (isLoading) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-8 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-blue-500 text-center">My Requests</h1>
      </div>

      {/* Requests List */}
      <div className="flex flex-col items-center mt-10 px-4">
        {myRequests?.length === 0 ? (
          <div className="text-gray-400 text-lg mt-20">No requests found.</div>
        ) : (
          <div className="w-full max-w-5xl max-h-[70vh]">
            {myRequests?.map((request) => (
              <div
                key={request._id.toString()}
                className="flex flex-col bg-gray-800 rounded-lg shadow-xl p-6 my-4 hover:scale-105 transform transition-transform duration-300"
              >
                {/* Request Details */}
                <div className="text-xl font-semibold text-white">{request.subjectName}</div>
                <div className="text-sm text-gray-400 mt-2">{request.description}</div>
                <div className="text-sm text-gray-500 mt-2">
                  Applied: <span className="font-semibold text-white">{request.applied}</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Price: <span className="font-semibold text-white">₹{request.price}</span>
                </div>

                {/* Attachments */}
                {request.attachments.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm text-gray-300 font-semibold">Attachments:</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {request.attachments.map((attachment, index) => (
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

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                  {/* View Details */}
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => router.push(`/study-requests/${request._id.toString()}`)}
                  >
                    View Details
                  </button>

                  {/* Edit */}
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => router.push(`/study-requests/edit-request/${request._id.toString()}`)}
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => setDeletePopup({ visible: true, requestId: request._id.toString() })}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {deletePopup.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-red-500 text-center">Confirm Deletion</h2>
            <p className="text-gray-300 text-center mt-4">
              Are you sure you want to delete this request? This action cannot be undone.
            </p>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                onClick={() => setDeletePopup({ visible: false, requestId: null })}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
