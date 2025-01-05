'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import {useModel} from "../../../hooks/user-model-store";
import DotsLoader from "../../../components/loading/dotLoader";

export default function ClubsPage() {
  const { allClubs, setAllClub, isLoading, setLoading } = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clubs`);
        if (res.status === 200) {
          setAllClub(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, setAllClub, setLoading]);

  if (isLoading) {
    return <DotsLoader />;
  }

  if (allClubs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <div className="w-full py-10 bg-gray-950 shadow-lg">
          <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
            No Clubs Available
          </h1>
        </div>
        <div className="flex flex-col items-center mt-20 px-4">
          <div className="text-gray-400 text-lg">There are no clubs to display right now.</div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-10 bg-gray-950 shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-blue-500 tracking-wide">
          Clubs
        </h1>
      </div>

      {/* Clubs List */}
      <div className="flex flex-col items-center mt-10 px-4">
        <div className="w-full max-w-7xl max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {allClubs.map((club) => (
            <div
              key={club._id.toString()}
              className="flex flex-col md:flex-row w-full bg-gray-800 rounded-lg shadow-lg items-center justify-between p-6 my-8 hover:scale-105 transform transition-transform duration-300"
            >
              {/* Club Logo */}
              <div className="flex justify-center items-center mb-6 md:mb-0 md:mr-8">
                <img
                  src={club.clubLogo || "https://india.acm.org/images/acm_rgb_grad_pos_diamond.png"}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 shadow-lg border-blue-500"
                  alt={`${club.clubName} Logo`}
                />
              </div>

              {/* Club Details */}
              <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
                <div className="text-2xl font-bold text-white mb-4">{club.clubName}</div>

                {/* View Club Button */}
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold shadow-xl transition-all duration-300 mt-4 md:mt-0"
                  onClick={() => router.replace(`clubs/edit-club/${club._id.toString()}`)}
                >
                  Edit Club
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}