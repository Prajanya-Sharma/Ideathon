"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import NavigatorButton from "../../../components/general/navigator";
import DotsLoader from "@/components/loading/dotLoader";

export default function AddEventPage() {
  const [eventHostedBy, setEventHostedBy] = useState<string>("");
  const [tag1, setTag1] = useState<string>("");
  const [tag2, setTag2] = useState<string>("");
  const [tag3, setTag3] = useState<string>("");
  const [heading, setHeading] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [poster, setPoster] = useState<string>("");
  const [eventAttachments, seteventAttachments] = useState<string[]>([]);
  const [clubs, setClubs] = useState<{ clubName: string }[]>([]);
  const [eventVenue, setEventVenue] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  function handlePosterUpload(result: any) {
    if (result.event === "success") {
      setPoster(result.info.secure_url);
    }
  }

  function handleEventAttachmentsUpload(result: any) {
    if (result.event === "success") {
      seteventAttachments((prev) => [...prev, result.info.secure_url]);
    }
  }

  async function handleAddEvent() {
    if (!poster || !date || !time || !eventHostedBy || !description || !eventVenue) {
      return;
    }
    const tags = [];
    if (tag1) tags.push(tag1);
    if (tag2) tags.push(tag2);
    if (tag3) tags.push(tag3);

    const eventTime = new Date(`${date}T${time}`);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/add-event`,
      {
        eventHostedBy,
        poster,
        heading,
        tags,
        description,
        eventAttachments,
        eventVenue,
        eventTime,
      }
    );

    if (res.status === 200) {
      redirect(`/events/${res.data._id}`);
    }
  }

  async function fetchClubs() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clubs/head`
      );
      if (response.status === 403) {
        redirect("/");
      }
      setClubs(response.data);
    } catch (err) {
      console.error(err);
      redirect("/");
    }
  }

  useEffect(() => {
    fetchClubs();
  }, []);

  if (clubs.length === 0) {
    return (
      <DotsLoader />
    );
  }

  const dropdownItems = [
    { label: "Events", href: "/events" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Home", href: "/" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-[#0B0C10] p-4">
      <div className="absolute top-6 right-6">
        <NavigatorButton buttonText="Navigate" dropdownItems={dropdownItems} />
      </div>
      <div className="w-full max-w-4xl p-6 bg-gradient-to-br from-[#1F2833] to-[#0B0C10] text-white rounded-lg shadow-xl">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-300">Add Event</h1>

        {/* Form Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Club Selection */}
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-300">Select Club</label>
            <select
              value={eventHostedBy}
              onChange={(e) => setEventHostedBy(e.target.value)}
              className="w-full p-2  text-gray-300 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select</option>
              {clubs.map((club) => (
                <option value={club.clubName} key={club.clubName}>
                  {club.clubName}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <label className="block text-lg font-semibold  text-gray-300">Select Tags</label>
            {[tag1, tag2, tag3].map((tag, index) => (
              <select
                key={index}
                value={tag}
                onChange={(e) =>
                  index === 0
                    ? setTag1(e.target.value)
                    : index === 1
                      ? setTag2(e.target.value)
                      : setTag3(e.target.value)
                }
                className="w-full p-2 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
              >
                {["Tech", "Coding", "Robotics", "Music", "Dance", "Art", "Comedy", ""].map((tag, index) => (
                  <option value={tag} key={index}>{tag}</option>
                ))}
              </select>
            ))}
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-6 mt-8">
          <div>
            <label className="block text-lg font-semibold text-gray-300">Heading</label>
            <input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              type="text"
              placeholder="Event Heading"
              className="w-full p-2 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold  text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event Description"
              className="w-full p-2 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-lg font-semibold  text-gray-300">Event Venue</label>
            <input
              value={eventVenue}
              onChange={(e) => setEventVenue(e.target.value)}
              type="text"
              placeholder="Enter the event venue"
              className="w-full p-2 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold  text-gray-300">Date</label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                className="w-full p-2 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold  text-gray-300">Time</label>
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                type="time"
                className="w-full p-2 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Poster & Attachments */}
        <div className="space-y-6 mt-8">
          <div className="flex items-center space-x-4">
            <label className="block text-lg font-semibold  text-gray-300">Poster</label>
            <CldUploadButton
              uploadPreset={
                process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string
              }
              onSuccess={handlePosterUpload}
              className="px-4 py-2 bg-gradient-to-br from-cyan-800 to-blue-700 hover:from-blue-600 hover:to-cyan-600 text-white rounded shadow hover:scale-105 transform transition-all duration-300"
            >
              Upload
            </CldUploadButton>
          </div>
          {poster && (
            <div>
              <label className="block text-lg font-semibold  text-gray-300">Uploaded Poster:</label>
              <img src={poster} alt="Event Poster" className="w-full h-auto rounded-lg mt-2" />
            </div>
          )}

          <div className="flex items-center space-x-4">
            <label className="block text-lg font-semibold  text-gray-300">Attachments</label>
            <CldUploadButton
              uploadPreset={
                process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string
              }
              onSuccess={handleEventAttachmentsUpload}
              className="px-4 py-2 bg-gradient-to-br from-cyan-800 to-blue-600 hover:from-blue-600 hover:to-cyan-600 text-white rounded shadow hover:scale-105 transform transition-all duration-300"
            >
              Upload
            </CldUploadButton>
          </div>
          {eventAttachments.length > 0 && (
            <div>
              <label className="block text-lg font-semibold  text-gray-300">Uploaded Attachments:</label>
              <ul className="list-disc list-inside space-y-2">
                {eventAttachments.map((attachment, index) => (
                  <li key={index} className="text-gray-300">
                    <a
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-cyan-500"
                    >
                      Attachment {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleAddEvent}
            className="px-11 py-3 bg-gradient-to-br from-cyan-900 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-500 hover:scale-105 transform transition-all duration-300"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
}
