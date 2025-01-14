"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";

export default function AddClubPage() {
  const [clubName, setClubName] = useState<string>("");
  const [clubLogo, setClubLogo] = useState<string>("");
  const [secyId, setSecyId] = useState<string>("");
  const [clubIdSecs, setClubIdSecs] = useState<string[]>([]);
  const [studentId, setStudentId] = useState<string>("");
  const [clubMembers, setClubMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/clubs/add-club`, {
        clubName,
        clubLogo,
        clubIdSecs,
        clubMembers,
      });

      if (res.status === 200) {
        alert("Club added successfully!");
        router.push(`/clubs/${res.data._id}`);
      } else {
        alert("Failed to add club. Please try again.");
      }
    } catch (error) {
      console.error("Error adding club:", error);
      alert("An error occurred while adding the club.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-950 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-blue-500 mb-6 text-center">Add New Club</h1>

        {/* Club Name */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Club Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            required
          />
        </div>

        {/* Club Logo */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Club Logo</label>
          <CldUploadButton
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string}
            onSuccess={handleLogoUpload}
            className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upload Logo
          </CldUploadButton>
        </div>

        {/* Secretary Section */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Secretary ID</label>
          <div className="flex space-x-4">
            <input
              type="text"
              className="w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Secretary SID"
              value={secyId}
              onChange={(e) => setSecyId(e.target.value)}
            />
            <button
              className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded-lg"
              onClick={handleAddSecy}
            >
              Add Secretary
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-2">
            {clubIdSecs.map((secId) => (
              <div
                key={secId}
                className="flex justify-between items-center bg-gray-800 rounded-lg px-4 py-2 text-white"
              >
                <span>{secId}</span>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => setClubIdSecs(clubIdSecs.filter((id) => id !== secId))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Members Section */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Student ID</label>
          <div className="flex space-x-4">
            <input
              type="text"
              className="w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Student SID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <button
              className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded-lg"
              onClick={handleAddMember}
            >
              Add Member
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-2">
            {clubMembers.map((studentId) => (
              <div
                key={studentId}
                className="flex justify-between items-center bg-gray-800 rounded-lg px-4 py-2 text-white"
              >
                <span>{studentId}</span>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => setClubMembers(clubMembers.filter((id) => id !== studentId))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Club Button */}
        <button
          className={`w-full py-2 px-6 rounded-lg font-semibold shadow-lg text-white transition-all duration-300 ${
            loading ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleAddClub}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Club"}
        </button>
      </div>
    </div>
  );
}
