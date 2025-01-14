"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DotsLoader from "../../../components/loading/dotLoader";
import mongoose from "mongoose";

interface Issue {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  attachments: string[];
  author: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export default function MyIssuesPage() {
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchIssues() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/my-issues`);
        if (res.status === 200) {
          setIssues(res.data);
        } else {
          router.push("/");
          console.error("Failed to fetch issues");
        }
      } catch (error) {
        router.push("/");
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);

  async function handleDelete(issueId: string) {
    setDeleting(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/${issueId}`
      );
      if (res.status === 200) {
        setIssues((prevIssues) =>
          prevIssues?.filter((issue) => issue._id.toString() !== issueId) ?? null
        );
        setDeleteId(null); // Clear the delete popup after successful delete
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
    } finally {
      setDeleting(false);
    }
  }

  if (loading || deleting) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-10 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
          My Issues
        </h1>
        <div className="text-center mt-4 flex justify-center gap-4">
          {/* Add Issue Button */}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
            onClick={() => router.push("/issues/add-issue")}
          >
            Add Issue
          </button>

          {/* My Issues Button */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
            onClick={() => router.push("/issues")}
          >
            Issues
          </button>
        </div>
      </div>

      {/* Issues List */}
      <div className="flex flex-col items-center mt-10 px-4">
        {issues?.length === 0 ? (
          <div className="text-gray-400 text-lg mt-20">
            No issues have been added yet.
          </div>
        ) : (
          <div
            className="w-full max-w-5xl max-h-[70vh]">
            {issues?.map((issue) => (
              <div
                key={issue._id.toString()}
                className="flex flex-col bg-gray-800 rounded-lg shadow-xl p-6 my-4 hover:scale-105 transform transition-transform duration-300"
              >
                {/* Issue Details */}
                <div className="text-2xl font-bold text-white">{issue.title}</div>
                <div className="text-md text-gray-300 mt-4">{issue.description}</div>
                <div className="text-xs text-gray-500 mt-4">
                  Created At: {new Date(issue.createdAt).toLocaleString()}
                </div>

                {/* Attachments */}
                {issue.attachments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm text-gray-300 font-semibold">Attachments:</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {issue.attachments.map((attachment, index) => (
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

                {/* Buttons for Edit and Delete */}
                <div className="mt-6 flex items-center justify-between">
                  {/* Edit Button */}
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => router.push(`/issues/edit-issue/${issue._id.toString()}`)}
                  >
                    Edit Issue
                  </button>

                  {/* Delete Button */}
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => setDeleteId(issue._id.toString())}
                  >
                    Delete Issue
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-1/3 text-center">
            <h3 className="text-xl text-white mb-4">Are you sure you want to delete this issue?</h3>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-300"
                onClick={() => setDeleteId(null)} // Close the popup
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-300"
                onClick={() => handleDelete(deleteId)}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
