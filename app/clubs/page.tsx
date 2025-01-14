'use client'
import { useRouter } from "next/navigation";
import { useModel } from "../../hooks/user-model-store";
import { useEffect } from "react";
import axios from "axios";
import DotsLoader from "../../components/loading/dotLoader";

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
    return (
      <DotsLoader />
    );
  }

  if (allClubs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-semibold mb-4">No Clubs Available</h2>
          <p className="text-gray-300">There are no clubs to display right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allClubs.map((club) => (
            <div 
              key={club._id.toString()}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-gray-700"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 flex items-center justify-center">
                  <img
                    src={club.clubLogo || '/default-club-logo.png'}
                    alt={`${club.clubName} logo`}
                    className="w-32 h-32 object-contain"
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-4 text-center text-white">
                    {club.clubName}
                  </h3>
                  
                  <div className="mt-auto flex justify-center">
                    <button
                      onClick={() => router.push(`/clubs/${club._id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                    >
                      View Club
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}