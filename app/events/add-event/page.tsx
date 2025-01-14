"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import DotsLoader from "@/components/loading/dotLoader";
import EventMap from "../../test/page"; // Imported EventMap instead of MapComponent

export default function AddEventPage() {
  const [eventCoordinates, setEventCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [eventVenue, setEventVenue] = useState<string>("")
  const [eventHostedBy, setEventHostedBy] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState("");
  const [eventAttachments, setEventAttachments] = useState<string[]>([]);
  const [clubs, setClubs] = useState<{ clubName: string }[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string;

  function handlePosterUpload(result: any) {
    if (result.event === "success") setPoster(result.info.secure_url);
  }

  function handleEventAttachmentsUpload(result: any) {
    if (result.event === "success") {
      setEventAttachments((prev) => [...prev, result.info.secure_url]);
    }
  }

  function handleLocationSelect(lat: number, lng: number) {
    setEventCoordinates({ lat, lng });
  }

  async function handleAddEvent() {
    if (!poster || !date || !time || !eventHostedBy || !description || !eventVenue) {
      alert("Please fill all required fields.");
      return;
    }

    const eventTime = new Date(`${date}T${time}`);
    const payload = {
      eventHostedBy,
      poster,
      heading,
      tags,
      description,
      eventAttachments,
      eventVenue,
      eventTime,
      eventCoordinates
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/add-event`,
        payload
      );

      if (res.status === 200) router.push(`/events/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Error adding the event. Please try again.");
    }
  }


  useEffect(() => {
    async function fetchClubs() {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clubs/head`);
        if (response.status === 403) router.push("/");
        setClubs(response.data);
      } catch (err) {
        console.error(err);
        router.push("/");
      } finally {
        setLoading(false);
      }

    }

    fetchClubs();
  }, [router]);

  if (loading || clubs.length === 0) return <DotsLoader />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-[#0B0C10] p-4">
      <div className="w-full max-w-4xl p-6 bg-gradient-to-br from-[#1F2833] to-[#0B0C10] text-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-300">Add Event</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-lg font-semibold text-gray-300">Select Club</label>
            <select
              value={eventHostedBy}
              onChange={(e) => setEventHostedBy(e.target.value)}
              className="w-full p-2 text-gray-300 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select</option>
              {clubs.map((club) => (
                <option value={club.clubName} key={club.clubName}>
                  {club.clubName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-300">Tags</label>
            {[0, 1, 2].map((_, index) => (
              <select
                key={index}
                value={tags[index] || ""}
                onChange={(e) => {
                  const newTags = [...tags];
                  newTags[index] = e.target.value;
                  setTags(newTags);
                }}
                className="w-full p-2 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
              >
                {["Tech", "Coding", "Robotics", "Music", "Dance", "Art", "Comedy", ""].map((tag, idx) => (
                  <option value={tag} key={idx}>
                    {tag}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

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
            <label className="block text-lg font-semibold text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event Description"
              className="w-full p-2 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
              rows={4}
            />
          </div>

          <div className="mt-8">
            <EventMap
              onLocationSelect={handleLocationSelect} // Using EventMap instead of MapComponent
            />
            {eventCoordinates && (
              <p className="text-gray-300 mt-2">
                Selected Location: Latitude {eventCoordinates.lat}, Longitude {eventCoordinates.lng}
              </p>
            )}
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-300">Event Venue</label>
            <input
              value={eventVenue}
              onChange={(e) => setEventVenue(e.target.value)}
              type="text"
              placeholder="Event Heading"
              className="w-full p-2 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold text-gray-300">Date</label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                className="w-full p-2 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-300">Time</label>
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                type="time"
                className="w-full p-2 rounded bg-[#1F2833] border border-blue-300 focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-8">
          <div className="flex items-center space-x-4">
            <label className="block text-lg font-semibold text-gray-300">Poster</label>
            <CldUploadButton uploadPreset={uploadPreset} onSuccess={handlePosterUpload} className="upload-button">
              Upload
            </CldUploadButton>
          </div>
          {poster && <img src={poster} alt="Event Poster" className="rounded mt-2" />}

          <div className="flex items-center space-x-4">
            <label className="block text-lg font-semibold text-gray-300">Attachments</label>
            <CldUploadButton uploadPreset={uploadPreset} onSuccess={handleEventAttachmentsUpload} className="upload-button">
              Upload
            </CldUploadButton>
          </div>
          {eventAttachments.length > 0 && (
            <ul className="list-disc space-y-2">
              {eventAttachments.map((attachment, index) => (
                <li key={index}>
                  <a href={attachment} target="_blank" rel="noopener noreferrer" className="underline">
                    Attachment {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleAddEvent}
            className="submit-button"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
}
