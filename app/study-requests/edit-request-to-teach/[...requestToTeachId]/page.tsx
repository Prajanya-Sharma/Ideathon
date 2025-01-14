"use client";

import { useState, useEffect } from "react";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import DotsLoader from "@/components/loading/dotLoader";

interface StudyRequest {
  _id: string;
  subjectId: string;
  subjectName: string;
  description: string;
  attachments: string[];
  price: number;
}

export default function AddRequestToTeachPage() {
  const [studyRequest, setStudyRequest] = useState<StudyRequest | null>(null);
  const [description, setDescription] = useState<string>("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const params = useParams();
  const studyRequestId = params.requestToTeachId?.[0];
  const requestToTeachId = params.requestToTeachId?.[1];

  useEffect(() => {
    async function fetchStudyRequest() {
      if (!studyRequestId) return;
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/add-request-to-teach/${studyRequestId}`);
        const res2 = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/my-requests-to-teach/${requestToTeachId}`)

        if (res.status === 200 && res2.status === 200) {
          setStudyRequest(res.data);
          setDescription(res2.data.description);
          setPhoneNumber(res2.data.phoneNumber.toString());
          setAttachments(res2.data.attachments);
        } else {
          console.error("Failed to fetch study request");
        }
      } catch (error) {
        router.push("/");
        console.error("Error fetching study request:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudyRequest();
  }, [requestToTeachId, router, studyRequestId]);

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      setAttachments((prev) => [...prev, result.info.secure_url]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(description);
    console.log(phoneNumber.length);
    if (!description || phoneNumber.length !== 10) {
      alert("Description and Phone Number are required!");
      return;
    }

    if (isNaN(Number(phoneNumber))) {
      alert("Phone number must be a number!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/my-requests-to-teach/${requestToTeachId}`,
        {
          description,
          attachments,
          phoneNumber: Number(phoneNumber),
        }
      );

      if (res.status === 200) {
        alert("Request to teach submitted successfully!");
        router.push("/study-requests/my-requests-to-teach");
      } else {
        alert("Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting request to teach:", error);
      alert("An error occurred while updating the request.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !studyRequest) {
    return (
      <DotsLoader />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-8 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-blue-500 text-center">
          Edit Teach Request
        </h1>
      </div>

      {/* Study Request Details */}
      <div className="max-w-5xl mx-auto mt-8 bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white">{studyRequest.subjectName}</h2>
        <p className="text-gray-300 mt-4">{studyRequest.description}</p>
        <div className="mt-4">
          <strong className="text-gray-400">Price:</strong>{" "}
          <span className="text-white">${studyRequest.price}</span>
        </div>
        {studyRequest.attachments.length > 0 && (
          <div className="mt-4">
            <strong className="text-gray-400">Attachments:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {studyRequest.attachments.map((attachment, index) => (
                <li key={index}>
                  <a
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {attachment}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Request to Teach Form */}
      <div className="max-w-5xl mx-auto mt-8 bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white text-center">Your Application</h2>
        <form onSubmit={handleSubmit} className="mt-6">
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

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

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
