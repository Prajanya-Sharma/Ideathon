"use client"

import {useModel} from "../../hooks/user-model-store";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import axios from "axios";
import DotsLoader from "../../components/loading/dotLoader";

export default function ResourcePage() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const { isLoading, setLoading } = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/resources`);
        if (res.status === 200) {
          setSubjects(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, setSubjects, setLoading]);

  if (isLoading) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-10 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
          Resources
        </h1>
      </div>

      {/* Resources List */}
      <div className="flex flex-col items-center mt-10 px-4">
        {subjects.length === 0 ? (
          <div className="text-gray-400 text-lg mt-20">
            No resources found. Please upload some resources!
          </div>
        ) : (
          <div className="w-full max-w-5xl max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {subjects.map((subject) => (
              <div
                key={subject}
                className="flex flex-row w-full bg-gray-800 rounded-lg shadow-xl items-center justify-between p-6 my-4 hover:scale-105 transform transition-transform duration-300"
              >
                {/* Subject Name */}
                <div className="text-lg font-semibold text-white">{subject}</div>

                {/* Action Button */}
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                  onClick={() => router.push(`/resources/${subject}`)}
                >
                  View Resources
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}