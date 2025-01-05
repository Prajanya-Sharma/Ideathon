"use client"
import {useModel} from "../../../../hooks/user-model-store";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import axios from "axios";
import mongoose from "mongoose";
import DotsLoader from "../../../../components/loading/dotLoader";

interface Teacher {
  _id: mongoose.Types.ObjectId;
  user: {
    email: string;
    username: string;
  }
  teacher_id: string;
  subjectTeaching: {
    subject_code: string;
    subject_name: string;
  }[];
}

export default function TeachersPage() {
  const [single, setSingle] = useState<boolean>(false);
  const [teacher, setTeacher] = useState<Teacher|null>(null);
  const [subject_code, setSubjectCode] = useState<string>("");
  const [subject_name, setSubjectName] = useState<string>("");
  const { teachers, setTeachers, isLoading, setLoading } = useModel()
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/subjects/teacher`);
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

  async function addSubject (teacherId: string) {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/subjects/teacher/add/${teacherId}`, {subject_code, subject_name})

      if (res.status === 200 && teacher) {
        setTeacher({
          ...teacher,
          subjectTeaching: [...teacher.subjectTeaching, {subject_name, subject_code}]
        });
        setTeachers(teachers.filter((teacher)=> teacher._id.toString() !== teacherId));
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

  async function removeSubject (teacherId: string, subject_code: string, subject_name: string) {
    setLoading(true);
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/subjects/teacher/remove/${teacherId}`, {subject_code, subject_name})

      if (res.status === 200 && teacher) {
        setTeacher({
          ...teacher,
          subjectTeaching: teacher.subjectTeaching.filter((subjectTeaching) => !(subjectTeaching.subject_code === subject_code && subjectTeaching.subject_name === subject_name))
        });
        setTeachers(teachers.filter((teacher)=> teacher._id.toString() !== teacherId));
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

  if (!single) {
    return (
      <>
        <div className="flex flex-col items-center h-screen w-full bg-gray-800">
          <div className="text-3xl font-bold text-white">
            Teachers
          </div>
          {teachers.map((teacher) =>
            <div key={teacher._id.toString()} className="flex flex-row w-2/3 h-24 bg-gray-950 mt-12 rounded-full items-center justify-around text-white text-lg font-bold">
              <div>
                {teacher.user.username}
              </div>
              <div>
                {teacher.user.email}
              </div>
              <div>
                {teacher.teacher_id}
              </div>
              <button
                className="bg-white text-gray-950 h-14 w-48 rounded-full"
                onClick={() => {
                  setTeacher(teacher);
                  setSingle(true);
                }}
              >
                Show Subjects
              </button>
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center h-screen w-full bg-gray-800">
        <button className="text-xl h-16 w-56 font-bold bg-white text-gray-950 mt-12 rounded-full" onClick={() => {
          setSingle(false);
          setTeacher(null);
        }}>
          Show all Teachers
        </button>
        <div className="flex flex-row justify-between h-16 w-2/3 mt-16">
          <input
            type="text"
            placeholder="subject code"
            value={subject_code}
            className="w-60 pl-2"
            onChange={(e) => setSubjectCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="subject name"
            value={subject_name}
            className="w-60 pl-2"
            onChange={(e) => setSubjectName(e.target.value)}
          />
          <button onClick={()=> teacher && addSubject(teacher?._id.toString())} className="bg-white text-gray-950 h-14 w-48 rounded-full text-xl font-bold">
            Add Subject
          </button>
        </div>
        {teacher && teacher.subjectTeaching.map((subject)=> (
          <div key={subject.subject_code} className="flex flex-row w-2/3 h-24 bg-gray-950 mt-12 rounded-full items-center justify-around font-bold">
            <div className="text-white">
              {subject.subject_code}
            </div>
            <div>
              {subject.subject_name}
            </div>
            <button className="bg-red-700 text-white h-14 w-48 rounded-full" onClick={() => removeSubject(teacher?._id.toString(), subject.subject_code, subject.subject_name)}>
              remove Subject
            </button>
          </div>
        ))}
      </div>
    </>
  )
}