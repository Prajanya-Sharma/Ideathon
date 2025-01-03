"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import {useModel} from "../../../../../hooks/user-model-store";
import DotsLoader from "../../../../../components/loading/dotLoader";

export default function UploadResourcesPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId?.[0];
  const { resources, setResources, isLoading, setLoading } = useModel();
  const [file, setResourceToDelete] = useState<{url:string, fileName:string}|null>(null); // Resource to confirm deletion
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);

  useEffect(() => {
    async function fetchResources() {
      if (!subjectId) return;
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/subjects/resources/${subjectId}`);
        if (res.status === 200) {
          setResources(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [subjectId, router, setLoading, setResources]);

  async function handleUploadSuccess(result: any) {
    console.log(result)
    try {
      const file = {
        url: result.info.secure_url,
        fileName: result.info.original_filename,
      };

      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/subjects/resources/${subjectId}`, {file});
      if (res.status === 200) {
        setResources([...resources, file]);
      }
    } catch (error) {
      console.error("Error saving uploaded file to backend:", error);
    }
  }

  async function handleDelete() {
    if (!file) return;
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/subjects/resources/${subjectId}`, {
        data: file,
      });

      if (res.status === 200) {
        setResources(resources.filter((res) => res.url !== file.url));
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    } finally {
      setShowDeletePopup(false);
      setResourceToDelete(null);
    }
  }

  if (isLoading) {
    return <DotsLoader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-10 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
          Upload Resources for Subject: {subjectId || "N/A"}
        </h1>
      </div>

      {/* Upload Section */}
      <div className="flex flex-col items-center mt-10 px-4 space-y-6">
        <div className="flex flex-col items-center w-full max-w-xl">
          <label className="text-lg font-semibold text-gray-400 mb-4">
            Upload Resource File
          </label>

          {/* Cloudinary Upload Button */}
          <CldUploadButton
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""}
            onSuccess={handleUploadSuccess}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300 cursor-pointer"
          >
            Upload File
          </CldUploadButton>
        </div>

        {/* Uploaded Resources */}
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

                  {/* View and Delete Actions */}
                  <div className="flex space-x-4">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    >
                      View
                    </a>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                      onClick={() => {
                        setResourceToDelete(resource);
                        setShowDeletePopup(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-4">
              Are you sure you want to delete this resource?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
