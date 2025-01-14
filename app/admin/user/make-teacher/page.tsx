"use client";

import { useModel } from "../../../../hooks/user-model-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import DotsLoader from "../../../../components/loading/dotLoader";

export default function MakeTeacherPage() {
  const { requests, setRequests, setLoading } = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/user/teacher`
        );
        if (res.status === 200) {
          setRequests(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching current teacher requests:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setRequests, setLoading, router]);

  if (!requests) {
    return <DotsLoader />;
  }

  async function rejectRequest(userId: string) {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/user/teacher/reject/${userId}`
      );

      if (res.status === 200) {
        setRequests(
          requests.filter((request) => request.user._id.toString() !== userId)
        );
      }
    } catch (error) {
      console.error("Failed to reject teacher request", error);
    } finally {
      setLoading(false);
    }
  }

  async function acceptRequest(userId: string) {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/user/teacher/accept/${userId}`
      );

      if (res.status === 200) {
        setRequests(
          requests.filter((request) => request.user._id.toString() !== userId)
        );
      }
    } catch (error) {
      console.error("Failed to accept teacher request", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header Section */}
      <div className="py-6 w-full bg-gray-950 shadow-md">
        <h1 className="text-center text-3xl font-bold text-teal-400">
          Manage Teacher Requests
        </h1>
      </div>

      {/* Requests List */}
      <div className="flex flex-col items-center w-full px-4 mt-8">
        {requests.map((request) => (
          <div
            key={request._id.toString()}
            className="flex flex-row items-center justify-between w-full max-w-4xl p-4 mb-6 bg-gray-800 rounded-lg shadow-lg"
          >
            {/* User Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-lg font-semibold text-teal-400">
                {request.user.username}
              </div>
              <div className="text-gray-400">{request.user.email}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                className="px-6 py-2 text-white transition-all duration-300 bg-red-600 rounded-lg shadow-md hover:bg-red-700"
                onClick={() => rejectRequest(request.user._id.toString())}
              >
                Reject
              </button>
              <button
                className="px-6 py-2 text-white transition-all duration-300 bg-green-600 rounded-lg shadow-md hover:bg-green-700"
                onClick={() => acceptRequest(request.user._id.toString())}
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
