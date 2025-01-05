"use client"

import {useParams, useRouter} from "next/navigation";
import {useModel} from "../../../hooks/user-model-store";
import {useEffect} from "react";
import axios from "axios";
import DotsLoader from "../../../components/loading/dotLoader";

export default function SingleResourcePage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId?.[0];
  const {resources, setResources, isLoading, setLoading} = useModel();

  useEffect(() => {
    async function fetchResources() {
      if (!subjectId) return;
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/resources/${subjectId}`);
        if (res.status === 200) {
          setResources(res.data);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        router.push("/resources");
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [subjectId, router, setLoading, setResources]);

  if (isLoading) {
    return <DotsLoader/>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-10 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
          Resources for Subject: {subjectId || "N/A"}
        </h1>
      </div>

      {/* Uploaded Resources */}
      <div className="flex flex-col items-center mt-10 px-4 space-y-6">
        <div className="w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-white text-center my-4">
            Uploaded Resources
          </h2>
          {resources.length === 0 ? (
            <div className="text-gray-400 text-lg text-center">
              No resources uploaded yet.
            </div>
          ) : (
            <div
              className="flex flex-col space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
            >
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between bg-gray-800 rounded-lg shadow-xl p-4 hover:scale-105 transform transition-transform duration-300"
                >
                  {/* Resource File Name */}
                  <div className="text-white">{resource.fileName || "Unnamed File"}</div>

                  {/* View Action */}
                  <div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}