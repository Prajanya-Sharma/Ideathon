"use client";

import {useEffect, useState} from "react";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import DotsLoader from "@/components/loading/dotLoader";

export default function AddStudyRequestPage() {
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [price, setPrice] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const studyRequestId = params.studyRequestId?.[0];

  useEffect(() => {
    async function fetchStudyRequests() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/my-requests/${studyRequestId}`);
        if (res.status === 200) {
          setSubjectId(res.data.subjectId);
          setSubjectName(res.data.subjectName);
          setDescription(res.data.description);
          setAttachments(res.data.attachments);
          setPrice(res.data.price);
        } else {
          router.push("/study-requests");
          console.error("Failed to fetch study requests");
        }
      } catch (error) {
        router.push("/");
        console.error("Error fetching study requests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudyRequests();
  }, [router, setLoading, studyRequestId]);

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      setAttachments((prev) => [...prev, result.info.secure_url]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectId || !subjectName || !description) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/my-requests/${studyRequestId}`, {
        subjectId,
        subjectName,
        description,
        attachments,
        price,
      });

      if (res.status === 200) {
        alert("Study request created successfully!");
        router.push("/study-requests/my-requests");
      } else {
        alert("Failed to update study request. Please try again.");
      }
    } catch (error) {
      console.error("Error updating study request:", error);
      alert("An error occurred while updating the study request.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DotsLoader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-950 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-blue-500 mb-6 text-center">
          Add New Study Request
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Subject ID */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Subject ID</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            />
          </div>

          {/* Subject Name */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Subject Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Attachments */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Attachments</label>
            <CldUploadButton
              uploadPreset={
                process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string
              }
              onSuccess={handleUpload}
            />
            <div className="flex flex-wrap mt-4">
              {attachments.map((attachment, index) => (
                <img
                  key={index}
                  src={attachment}
                  alt="attachment"
                  className="w-20 h-20 object-cover rounded-lg border-2 border-gray-700 mr-4 mb-4"
                />
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Price (₹)</label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-6 rounded-lg font-semibold shadow-lg text-white transition-all duration-300 ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}
