"use client"
import {useModel} from "../../../../hooks/user-model-store";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import axios from "axios";
import DotsLoader from "@components/loading/dotLoader";
export default function FriendRequests() {
  const { currentRequests, setCurrentRequests, setLoading } = useModel()
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/current-requests`);
        if (res.status === 200) {
          setCurrentRequests(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching current requests:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setCurrentRequests, setLoading, router]);

  if (!currentRequests) {
    return <DotsLoader />;
  }

  async function rejectRequest (to: string, from: string) {
    setLoading(true);
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/reject-friend/${to}/${from}`)

      if (res.status === 200) {
        setCurrentRequests(currentRequests.filter((request)=> request.from._id.toString() !== from));
      }
    } catch (error) {
      console.error("Failed to reject request", error);
    } finally {
      setLoading(false);
    }
  }

  async function acceptRequest (to: string, from: string) {
    setLoading(true);
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/accept-friend/${to}/${from}`)

      if (res.status === 200) {
        setCurrentRequests(currentRequests.filter((request)=> request.from._id.toString() !== from));
      }
    } catch (error) {
      console.error("Failed to accept request", error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-auto">
      {/* Page Header */}
      {/* <div className="w-full py-10 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
          Friend Requests
        </h1>
      </div> */}

      {/* Friend Requests List */}
      <div className="flex flex-col items-center px-4">
        {currentRequests.length === 0 ? (
          <div className="text-gray-400 text-lg mt-20">
            You have no pending friend requests.
          </div>
        ) : (
          <div
            className="w-full max-w-5xl max-h-[70vh]">
            {currentRequests.map((request) => (
              <div
                key={request._id.toString()}
                className="flex flex-row w-full bg-gray-800 rounded-lg shadow-xl items-center justify-between p-6 my-4 hover:scale-105 transform transition-transform duration-300"
              >
                {/* Profile Picture and Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={request.from.profile}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <div className="text-lg font-semibold text-white">{request.from.name}</div>
                    <div className="text-sm text-gray-400">{request.from.student_id}</div>
                  </div>
                </div>

                {/* Accept and Reject Buttons */}
                <div className="flex space-x-4">
                  <button
                    className="bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => rejectRequest(request.to.toString(), request.from._id.toString())}
                  >
                    Reject
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => acceptRequest(request.to.toString(), request.from._id.toString())}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}