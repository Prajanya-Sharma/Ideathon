"use client";

import { useModel } from "../../../../hooks/user-model-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import DotsLoader from "../../../../components/loading/dotLoader";

export default function MakeAdminPage() {
  const { requests, setRequests, setLoading } = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/user/admin`);
        if (res.status === 200) {
          setRequests(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching current admin requests:", error);
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/user/admin/reject/${userId}`
      );

      if (res.status === 200) {
        setRequests(requests.filter((request) => request.user._id.toString() !== userId));
      }
    } catch (error) {
      console.error("Failed to reject admin request", error);
    } finally {
      setLoading(false);
    }
  }

  async function acceptRequest(userId: string) {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/user/admin/accept/${userId}`
      );

      if (res.status === 200) {
        setRequests(requests.filter((request) => request.user._id.toString() !== userId));
      }
    } catch (error) {
      console.error("Failed to accept admin request", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="py-6 bg-gray-950 w-full shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-500">Manage Admin Requests</h1>
      </div>

      {/* Request List */}
      <div className="flex flex-col items-center mt-8 w-full px-4">
        {requests.map((request) => (
          <div
            key={request._id.toString()}
            className="flex flex-row w-full max-w-4xl items-center justify-between bg-gray-800 text-white p-4 rounded-lg shadow-md mb-6"
          >
            {/* User Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-lg font-semibold">{request.user.username}</div>
              <div className="text-gray-400">{request.user.email}</div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow-lg transition-all duration-300"
                onClick={() => rejectRequest(request.user._id.toString())}
              >
                Reject
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-lg transition-all duration-300"
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
