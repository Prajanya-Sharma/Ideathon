"use client"

import {useModel} from "../../../hooks/user-model-store";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import axios from "axios";
import DotsLoader from "../../../components/loading/dotLoader";

export default function SubjectsPage() {
  const { subjects, setSubjects, setLoading } = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/subjects`);
        if (res.status === 200) {
          setSubjects(res.data);
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
  }, [router, setSubjects, setLoading]);

  if (!subjects) {
    return <DotsLoader />;
  }

  if (subjects.subjectTeaching.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-gray-400 text-lg">
          No subjects found. Please tell admin to add some subjects!
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-10 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
          Your Subjects
        </h1>
      </div>

      {/* Subjects List */}
      <div className="flex flex-col items-center mt-10 px-4">
        <div className="w-full max-w-5xl max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {subjects.subjectTeaching.map((subject) => (
            <div
              key={subject.subject_code}
              className="flex flex-col md:flex-row w-full bg-gray-800 rounded-lg shadow-xl items-center justify-between p-6 my-4 hover:scale-105 transform transition-transform duration-300"
            >
              {/* Subject Info */}
              <div className="text-lg font-semibold text-white">
                {subject.subject_code}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-4 md:mt-0">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                  onClick={()=> router.push(`/teacher/subjects/groups/${subject.subject_code}`)}
                >
                  Take Attendance
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                  onClick={()=> router.push(`/teacher/subjects/resources/${subject.subject_code}`)}
                >
                  Upload Resources
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}