"use client"
import {useEffect} from "react";
import {useModel} from "../../../../hooks/user-model-store";
import {useRouter} from "next/navigation";
import axios from "axios";
import DotsLoader from "@components/loading/dotLoader";
export default function RequestsSentPage() {
  const { requestsSent, setRequestsSent, setLoading } = useModel()
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/requests-sent`);
        if (res.status === 200) {
          setRequestsSent(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching requests sent:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setRequestsSent, setLoading, router]);

  if (!requestsSent) {
    return <DotsLoader />;
  }

  async function withdrawRequest (from: string, to: string) {
    setLoading(true);
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/withdraw-request/${from}/${to}`)

      if (res.status === 200) {
        setRequestsSent(requestsSent.filter((request)=> request.to._id.toString() !== to));
      }
    } catch (error) {
      console.error("Failed to withdraw request", error);
    } finally {
      setLoading(false);
    }

  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-auto">
        {/* Page Header */}
        {/* <div className="w-full py-10 bg-gray-950 shadow-lg">
          <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
            Requests Sent
          </h1>
        </div> */}

        {/* Requests Sent List */}
        <div className="flex flex-col items-center px-4">
          {requestsSent.length === 0 ? (
            <div className="text-gray-400 text-lg mt-20">
              You have not sent any requests.
            </div>
          ) : (
            <div className="w-full max-w-5xl max-h-[70vh]">
              {requestsSent.map((request) => (
                <div
                  key={request._id.toString()}
                  className="flex flex-row w-full bg-gray-800 rounded-lg shadow-xl items-center justify-between p-6 my-4 hover:scale-105 transform transition-transform duration-300"
                >
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={request.to.profile}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                    />
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {request.to.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {request.to.student_id}
                      </div>
                    </div>
                  </div>

                  {/* Withdraw Request Button */}
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() =>
                      withdrawRequest(request.from.toString(), request.to._id.toString())
                    }
                  >
                    Withdraw Request
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}