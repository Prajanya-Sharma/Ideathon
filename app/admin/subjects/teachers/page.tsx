"use client";

import { useModel } from "../../../../hooks/user-model-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import mongoose from "mongoose";
import DotsLoader from "../../../../components/loading/dotLoader";

interface Teacher {
  _id: mongoose.Types.ObjectId;
  user: {
    email: string;
    username: string;
  };
  teacher_id: string;
  subjectTeaching: {
    subject_code: string;
    subject_name: string;
  }[];
}

export default function TeachersPage() {
  const [single, setSingle] = useState<boolean>(false);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [subject_code, setSubjectCode] = useState<string>("");
  const [subject_name, setSubjectName] = useState<string>("");
  const { teachers, setTeachers, isLoading, setLoading } = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/subjects/teacher`
        );
        if (res.status === 200) {
          setTeachers(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching teachers", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setTeachers, setLoading, router]);

  async function addSubject(teacherId: string) {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/subjects/teacher/add/${teacherId}`,
        { subject_code, subject_name }
      );

      if (res.status === 200 && teacher) {
        setTeacher({
          ...teacher,
          subjectTeaching: [
            ...teacher.subjectTeaching,
            { subject_name, subject_code },
          ],
        });
        setTeachers(teachers.filter((t) => t._id.toString() !== teacherId));
        setTeachers([...teachers, teacher]);
        setSubjectCode("");
        setSubjectName("");
      }
    } catch (error) {
      console.error("Failed to add subject", error);
    } finally {
      setLoading(false);
    }
  }

  async function removeSubject(
    teacherId: string,
    subject_code: string,
    subject_name: string
  ) {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/subjects/teacher/remove/${teacherId}`,
        { subject_code, subject_name }
      );

      if (res.status === 200 && teacher) {
        setTeacher({
          ...teacher,
          subjectTeaching: teacher.subjectTeaching.filter(
            (s) =>
              !(
                s.subject_code === subject_code &&
                s.subject_name === subject_name
              )
          ),
        });
        setTeachers(teachers.filter((t) => t._id.toString() !== teacherId));
        setTeachers([...teachers, teacher]);
      }
    } catch (error) {
      console.error("Failed to remove subject", error);
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-8 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-blue-500 text-center">
          Teachers
        </h1>
      </div>

      {single && teacher ? (
        <div className="mt-10 px-4 flex flex-col items-center">
          {/* Back Button */}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-bold shadow-lg transition-all duration-300 mb-6"
            onClick={() => {
              setSingle(false);
              setTeacher(null);
            }}
          >
            Back to Teachers
          </button>

          {/* Subjects List */}
          <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Subjects for {teacher.user.username}
            </h2>
            {teacher.subjectTeaching.length > 0 ? (
              teacher.subjectTeaching.map((subject, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-700 rounded-md p-4 shadow-lg"
                >
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {subject.subject_name}
                    </p>
                    <p className="text-sm text-gray-400">
                      Code: {subject.subject_code}
                    </p>
                  </div>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-lg font-bold shadow-lg transition-all duration-300"
                    onClick={() =>
                      removeSubject(
                        teacher._id.toString(),
                        subject.subject_code,
                        subject.subject_name
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">
                No subjects found for this teacher.
              </p>
            )}

            {/* Add Subject Form */}
            <div className="flex flex-col mt-6 gap-4">
              <input
                type="text"
                placeholder="Subject Code"
                value={subject_code}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSubjectCode(e.target.value)}
              />
              <input
                type="text"
                placeholder="Subject Name"
                value={subject_name}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSubjectName(e.target.value)}
              />
              <button
                onClick={() => teacher && addSubject(teacher._id.toString())}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-bold shadow-lg transition-all duration-300"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10 px-4">
          {teachers.length === 0 ? (
            <p className="text-gray-400 text-lg">No teachers found.</p>
          ) : (
            <div className="w-full max-w-5xl">
              {teachers.map((teacher) => (
                <div
                  key={teacher._id.toString()}
                  className="flex flex-col bg-gray-800 rounded-lg shadow-xl p-6 my-4 hover:scale-105 transform transition-transform duration-300"
                >
                  <div>
                    <p className="text-xl font-semibold text-white">
                      {teacher.user.username}
                    </p>
                    <p className="text-sm text-gray-400">
                      {teacher.user.email}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Teacher ID:{" "}
                    <span className="font-semibold text-white">
                      {teacher.teacher_id}
                    </span>
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-bold shadow-lg transition-all duration-300 mt-4"
                    onClick={() => {
                      setTeacher(teacher);
                      setSingle(true);
                    }}
                  >
                    Show Subjects
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
