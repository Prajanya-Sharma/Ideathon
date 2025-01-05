"use client"
import {CldUploadButton} from "next-cloudinary";

import {useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";

export default function AddClubPage() {
  const [clubName, setClubName] = useState<string>("");
  const [clubLogo, setClubLogo] = useState<string>("");
  const [secyId, setSecyId] = useState<string>("");
  const [clubIdSecs, setClubIdSecs] = useState<string[]>([])
  const [studentId, setStudentId] = useState<string>("");
  const [clubMembers, setClubMembers] = useState<string[]>([]);

  const router = useRouter();

  function handleLogoUpload(result: any) {
    if (result.event === "success") {
      setClubLogo(result.info.secure_url);
    }
  }

  function handleAddSecy() {
    setClubIdSecs([...clubIdSecs, secyId]);
    setSecyId("");
  }

  function handleAddMember() {
    setClubMembers([...clubMembers, studentId]);
    setStudentId("");
  }

  async function handleAddClub() {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/clubs/add-club`, {
        clubName,
        clubLogo,
        clubIdSecs,
        clubMembers
        }
      )

      if (res.status === 200) {
        console.log("Club added successfully");
        router.push(`/clubs/${res.data._id.toString()}`);
      }
    } catch (error) {
      console.log("Error adding clubs:", error);
    }
  }

  return (
    <>
      <div className="h-screen bg-gray-800 text-xl w-wull flex flex-col items-center font-bold">
        <div className="text-3xl text-white font-bold mt-12">
          Add Club
        </div>
        <div className="flex flex-row w-2/5 justify-between mt-12">
          <label htmlFor="clubName" className="text-white">Club Name</label>
          <input className="w-80 h-12 pl-2" type="text" placeholder="Club Name" value={clubName}
                 onChange={(e) => setClubName(e.target.value)}/>
        </div>
        <div className="flex flex-row w-2/5 justify-between mt-12">
          <label htmlFor="clubLogo" className="text-white">Club Logo</label>
          <CldUploadButton
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string}
            onSuccess={handleLogoUpload}
            className="w-80 h-12 ml-12 bg-white rounded-full"
          >
            Upload Poster
          </CldUploadButton>
        </div>
        <div className="flex flex-row w-full mt-16">
          <div className="flex flex-col w-1/2">
            <div className="flex flex-row w-full items-center">
              <label htmlFor="" className="text-white ml-8">Enter Secy Student ID</label>
              <input className="w-40 h-12 ml-8 pl-2 rounded-2xl" type="text" placeholder={"Secy SID"} value={secyId}
                     onChange={(e) => setSecyId(e.target.value)}/>
              <button
                className="bg-white h-12 w-32 rounded-full ml-8"
                onClick={handleAddSecy}
              >
                Add Secy
              </button>
            </div>
            <div className="flex flex-col w-full h-96 overflow-y-auto overflow-hidden mt-10">
              {clubIdSecs.map((secId,) => {
                return (
                  <div key={secId}
                       className="flex flex-row items-center justify-between pl-2 pr-2 ml-8 w-2/3 h-12 bg-white rounded-2xl mt-10 flex-shrink-0">
                    <div>
                      {secId}
                    </div>
                    <button
                      className="bg-gray-800 h-8 text-white w-32 rounded-full"
                      onClick={() => setClubIdSecs(clubIdSecs.filter((id) => id !== secId))}
                    >
                      Remove
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col w-1/2">
            <div className="flex flex-row w-full items-center">
              <label htmlFor="" className="text-white ml-8">Enter Student ID</label>
              <input className="w-40 h-12 ml-8 pl-2 rounded-2xl" type="text" placeholder={"Student ID"}
                     value={studentId}
                     onChange={(e) => setStudentId(e.target.value)}/>
              <button
                className="bg-white h-12 w-32 rounded-full ml-8"
                onClick={handleAddMember}
              >
                Add Member
              </button>
            </div>
            <div className="flex flex-col w-full h-96 overflow-y-auto overflow-hidden mt-10">
              {clubMembers.map((student_Id) => {
                return (
                  <div key={student_Id}
                       className="flex flex-row items-center justify-between pl-2 pr-2 ml-8 w-2/3 h-12 bg-white rounded-2xl mt-10 flex-shrink-0">
                    <div>
                      {student_Id}
                    </div>
                    <button
                      className="bg-gray-800 h-8 text-white w-32 rounded-full"
                      onClick={() => setClubMembers(clubMembers.filter((id) => id !== student_Id))}
                    >
                      Remove
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <button
          className="bg-white h-12 w-40 rounded-full mt-12"
          onClick={handleAddClub}
        >
          Add Club
        </button>
      </div>
    </>
  )
}