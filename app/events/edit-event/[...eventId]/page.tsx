"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import NavigatorButton from "@/components/general/navigator";
import DotsLoader from "@/components/loading/dotLoader";
import EventMap from '../../../test/page'

export default function EditEventPage() {
  const [eventCoordinates, setEventCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [eventVenue, setEventVenue] = useState<string>("");
  const [eventHostedBy, setEventHostedBy] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [heading, setHeading] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [poster, setPoster] = useState<string>("");
  const [eventAttachments, setEventAttachments] = useState<string[]>([]);
  const [clubs, setClubs] = useState<{ clubName: string }[]>([]);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const router = useRouter();
  const { eventId } = useParams();

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string;

  // Handle upload success for poster
  function handlePosterUpload(result: any) {
    if (result.event === "success") setPoster(result.info.secure_url);
  }

  // Handle upload success for event attachments
  function handleEventAttachmentsUpload(result: any) {
    if (result.event === "success") {
      setEventAttachments((prev) => [...prev, result.info.secure_url]);
    }
  }

  // Handle the location selection from the map
  function handleLocationSelect(lat: number, lng: number) {
    setEventCoordinates({ lat, lng });
  }

  // Fetch event details for editing
  useEffect(() => {
    if (!eventId) return;

    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${eventId}`);
        const event = response.data.data;
        setEventHostedBy(event.eventHostedBy);
        setHeading(event.heading);
        setDescription(event.description);
        setPoster(event.poster);
        setEventVenue(event.eventVenue);
        setEventAttachments(event.eventAttachments);
        setDate(event.eventTime.slice(0, 10));
        setTime(event.eventTime.slice(11, 16));
        setTags(event.tags || []);
        setEventCoordinates(event.eventCoordinates);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  // Fetch clubs for event hosting options
  async function fetchClubs() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clubs/head`);
      if (response.status === 403) router.push("/");
      setClubs(response.data);
    } catch (err) {
      console.error(err);
      router.push("/");
    }
  }

  useEffect(() => {
    fetchClubs();
  }, []);

  // Save event details after editing
  async function handleEditEvent() {
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
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${eventId}`,
        payload
      );

      if (res.status === 200) router.push(`/events/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Error editing the event. Please try again.");
    }
  }

  if (clubs.length === 0) return <DotsLoader />;

  const dropdownItems = [
    { label: "Events", href: "/events" },
    { label: "Dashboard", href: "/profile" },
    { label: "Home", href: "/" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-[#0B0C10] p-4">
      <div className="absolute top-6 right-6">
        <NavigatorButton buttonText="Navigate" dropdownItems={dropdownItems} />
      </div>
      <div className="w-full max-w-4xl p-6 bg-gradient-to-br from-[#1F2833] to-[#0B0C10] text-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-300">Edit Event</h1>

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

          <div>
            <label className="block text-lg font-semibold text-gray-300">Event Venue</label>
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

        {/* Poster & Attachments */}
        <div className="space-y-6 mt-8">
          <div className="flex items-center space-x-4">
            <label className="block text-lg font-semibold text-gray-300">Poster</label>
            <CldUploadButton
              uploadPreset={uploadPreset}
              onUpload={handlePosterUpload}
              className="bg-[#0B0C10] text-white px-4 py-2 rounded-md cursor-pointer"
            >
              Upload Poster
            </CldUploadButton>
          </div>

          <div className="flex items-center space-x-4">
            <label className="block text-lg font-semibold text-gray-300">Event Attachments</label>
            <CldUploadButton
              uploadPreset={uploadPreset}
              onUpload={handleEventAttachmentsUpload}
              className="bg-[#0B0C10] text-white px-4 py-2 rounded-md cursor-pointer"
            >
              Upload Attachments
            </CldUploadButton>
          </div>
        </div>

        {/* Map Component for Location Selection */}
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

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleEditEvent}
            className="px-6 py-3 bg-[#4CAF50] text-white font-semibold rounded-lg hover:bg-[#45a049] transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
