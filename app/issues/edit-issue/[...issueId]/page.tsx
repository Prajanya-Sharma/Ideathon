"use client";

import {useEffect, useState} from "react";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import DotsLoader from "@/components/loading/dotLoader";

export default function AddIssuePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const issueId = params.issueId?.[0];


  useEffect(() => {
    async function fetchIssues() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/${issueId}`);
        if (res.status === 200) {
          setTitle(res.data.title);
          setDescription(res.data.description);
          setAttachments(res.data.attachments);
        } else {
          router.push("/my-issues");
          console.error("Failed to fetch issues");
        }
      } catch (error) {
        router.push("/mt-issues");
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      setAttachments((prev) => [...prev, result.info.secure_url]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Title and description are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/${issueId}`, {
        title,
        description,
        attachments,
      });

      if (res.status === 200) {
        router.push("/issues/my-issues");
      } else {
        alert("Failed to create issue. Please try again.");
      }
    } catch (error) {
      console.error("Error creating issue:", error);
      alert("An error occurred while creating the issue.");
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
        <h1 className="text-3xl font-extrabold text-blue-500 mb-6 text-center">Add New Issue</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

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
