"use client";

import {useEffect, useState} from "react";
import axios from "axios";
import DotsLoader from "../../../components/loading/dotLoader";
import {useParams, useRouter } from "next/navigation";
import { useModel } from "@/hooks/user-model-store";

export default function SingleRequestPage() {
  const { singleRequest, setSingleRequest, isLoading, setLoading } = useModel();
  const router = useRouter();
  const params = useParams();
  const studyRequestId = params.studyRequestId?.[0];

  const [rejectPopup, setRejectPopup] = useState<{visible: boolean, requestId: null|string}>({ visible: false, requestId: null });
  const [acceptPopup, setAcceptPopup] = useState<{visible: boolean, requestId: null|string, phoneNumber: string}>({ visible: false, requestId: null, phoneNumber: "" });


  useEffect(() => {
    async function fetchSingleRequest() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/${studyRequestId}`);
        if (res.status === 200) {
          setSingleRequest(res.data);
        } else {
          console.error("Failed to fetch request data");
        }
      } catch (error) {
        console.error("Error fetching request data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchSingleRequest();
  }, [params.id, router, setLoading, setSingleRequest, studyRequestId]);

  const handleAccept = async () => {
    if (!acceptPopup.requestId || acceptPopup.phoneNumber.length !== 10 || isNaN(Number(acceptPopup.phoneNumber))) return;
    try {
      setLoading(true);
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/my-requests/accept/${studyRequestId}/${acceptPopup.requestId}`,
        {phoneNumber: Number(acceptPopup.phoneNumber)},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.status === 200) {
        alert("Request accepted successfully!");
        setAcceptPopup({ visible: false, requestId: null, phoneNumber: "" });
        router.push("/study-requests/accepted-requests");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("An error occurred while accepting the request.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectPopup.requestId) return;
    try {
      setLoading(true);
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/my-requests/reject/${studyRequestId}/${rejectPopup.requestId}`
      );
      if (res.status === 200 && singleRequest) {
        alert("Request rejected successfully!");
        setSingleRequest({
            studyRequest: singleRequest?.studyRequest,
            requestsToTeach: singleRequest.requestsToTeach.filter(
              (req) => req._id.toString() !== rejectPopup.requestId
            ),
        });
        setRejectPopup({ visible: false, requestId: null });
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("An error occurred while rejecting the request.");
    } finally {
      setLoading(false);
    }
  };


  if (isLoading || !singleRequest) {
    return <DotsLoader />;
  }

  console.log(singleRequest);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-8 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-blue-500 text-center">
          Study Request Details
        </h1>
      </div>

      {/* Study Request Details */}
      <div className="flex flex-col items-center mt-10 px-4">
        <div className="w-full max-w-5xl bg-gray-800 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold text-white">
            {singleRequest.studyRequest.subjectName}
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            {singleRequest.studyRequest.description}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Price: <span className="font-semibold text-white">${singleRequest.studyRequest.price}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Applied: <span className="font-semibold text-white">{singleRequest.studyRequest.applied.length}</span>
          </p>
          {singleRequest.studyRequest.attachments.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm text-gray-300 font-semibold">Attachments:</h3>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {singleRequest.studyRequest.attachments.map((attachment, index) => (
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
        </div>

        {/* Requests to Teach */}
        <div className="w-full max-w-5xl mt-10">
          <h3 className="text-2xl font-extrabold text-blue-500 mb-6">Requests to Teach</h3>
          {singleRequest.requestsToTeach.length === 0 ? (
            <div className="text-gray-400 text-lg">No requests to teach found.</div>
          ) : (
            <div className="space-y-6">
              {singleRequest.requestsToTeach.map((request) => (
                <div
                  key={request._id.toString()}
                  className="bg-gray-800 rounded-lg shadow-xl p-6"
                >
                  <div className="text-lg font-semibold text-white">
                    Teacher: {request.teacher.name} ({request.teacher.student_id})
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{request.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Phone Number: <span className="font-semibold text-white">{request.phoneNumber}</span>
                  </p>

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

                  {/* Teacher Details */}
                  <div className="mt-6">
                    <h4 className="text-sm text-gray-300 font-semibold">Teacher Details:</h4>
                    <p className="text-sm text-gray-500 mt-2">
                      Branch: <span className="font-semibold text-white">{request.teacher.branch}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Semester: <span className="font-semibold text-white">{request.teacher.semester}</span>
                    </p>
                    {request.teacher.subjectMarks.map((subjectMark, index) => (
                      <div key={index} className="mt-2">
                        <h5 className="text-sm text-gray-300 font-semibold">
                          Subject ID: {subjectMark.subjectId}
                        </h5>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {subjectMark.allMarks.map((mark, i) => (
                            <li key={i} className="text-sm text-gray-400">
                              {mark.examType}: {mark.marks} marks
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                      onClick={() => setAcceptPopup({ visible: true, requestId: request._id.toString(), phoneNumber: "" })}                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                      onClick={() => setRejectPopup({ visible: true, requestId: request._id.toString() })}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Popup */}
      {rejectPopup.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-red-500 text-center">Confirm Rejection</h2>
            <p className="text-gray-300 text-center mt-4">
              Are you sure you want to reject this request?
            </p>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                onClick={() => setRejectPopup({ visible: false, requestId: null })}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Popup */}
      {acceptPopup.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-green-500 text-center">Confirm Acceptance</h2>
            <p className="text-gray-300 text-center mt-4">
              Please provide the phone number for confirmation.
            </p>
            <input
              type="text"
              className="mt-4 w-full px-4 py-2 text-black rounded-md"
              placeholder="Enter phone number"
              value={acceptPopup.phoneNumber}
              onChange={(e) =>
                setAcceptPopup({ ...acceptPopup, phoneNumber: e.target.value })
              }
            />
            <div className="flex justify-end mt-6 space-x-4">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                onClick={() => setAcceptPopup({ visible: false, requestId: null, phoneNumber: "" })}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                onClick={handleAccept}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}