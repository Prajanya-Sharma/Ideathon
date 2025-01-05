"use client"
import {useModel} from "../../../../hooks/user-model-store";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import axios from "axios";
import DotsLoader from "../../../../components/loading/dotLoader";

export default function MakeAdminPage() {
  const { requests, setRequests, setLoading } = useModel()
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

  async function rejectRequest (userId: string) {
    setLoading(true);
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/user/admin/reject/${userId}`)

      if (res.status === 200) {
        setRequests(requests.filter((request)=> request.user._id.toString() !== userId));
      }
    } catch (error) {
      console.error("Failed to reject admin request", error);
    } finally {
      setLoading(false);
    }
  }

  async function acceptRequest (userId: string) {
    setLoading(true);
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/user/admin/accept/${userId}`)

      if (res.status === 200) {
        setRequests(requests.filter((request)=> request.user._id.toString() !== userId));
      }
    } catch (error) {
      console.error("Failed to accept admin request", error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      <div className="flex flex-col items-center h-screen w-full bg-gray-800">
        {requests.map((request) =>
          <div key={request._id.toString()}
               className="flex flex-row w-2/3 h-24 bg-gray-950 mt-12 rounded-full items-center justify-around text-white text-lg font-bold">
            <div>
              {request.user.username}
            </div>
            <div>
              {request.user.email}
            </div>
            <button
              className="bg-red-700 text-white h-14 w-32 rounded-full"
              onClick={() => rejectRequest(request.user._id.toString())}
            >
              Reject
            </button>
            <button
              className="bg-white text-gray-950 h-14 w-32 rounded-full"
              onClick={() => acceptRequest(request.user._id.toString())}
            >
              Accept
            </button>
          </div>
        )}
      </div>
    </>
  )
}