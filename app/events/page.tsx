"use client";
import EventCard from "../../components/events/card";
import FilterBox from "../../components/events/filterbox";
import { useEffect, useState, useMemo } from "react";
import { useModel } from "../../hooks/user-model-store";
import axios from "axios";
import { useRouter } from "next/navigation";
import NavigatorButton from "../../components/general/navigator";

export default function EventsPage() {
  const { allEvents, isLoading, setAllEvents, setLoading } = useModel();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const [filterCriteria, setFilterCriteria] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = useMemo(() => {
    let events = allEvents;

    if (filterCriteria.length > 0) {
      events = events.filter((event) =>
        filterCriteria.every((filter) =>
          event.tags
            .map((tag) => tag.trim().toLowerCase())
            .includes(filter.trim().toLowerCase())
        )
      );
    }

    if (activeTab === "interested") {
      events = events.filter((event) => event.isInterested);
    } else if (activeTab === "notinterested") {
      events = events.filter((event) => !event.isInterested);
    }

    return events;
  }, [allEvents, filterCriteria, activeTab]);

  const maxPage = Math.ceil(filteredEvents.length / 10);

  const selectedEvents = useMemo(() => {
    const startIndex = (page - 1) * 10;
    return filteredEvents.slice(startIndex, startIndex + 10);
  }, [filteredEvents, page]);

  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events`);
        const events = await response.data;
        setAllEvents(events);
      } catch (error) {
        console.error("Failed to fetch all events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, [setAllEvents, setLoading]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const dropdownItems = [
    { label: "Events", href: "/events" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Home", href: "/" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gradient-to-b from-[#0B0C10] to-[#1F2833] overflow-auto relative">
      {/* Navigation Button */}
      <div className="absolute top-5 right-10 z-100">
        <NavigatorButton buttonText="Navigate" dropdownItems={dropdownItems} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full md:w-4/5 h-full items-center mt-6 md:mt-12 px-4">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center md:flex-row space-x-2 md:space-x-4 mb-4 md:mb-6">
          {["All", "Interested", "Not Interested"].map((tab) => (
            <button
              key={tab}
              className={`px-4 md:px-6 py-2 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out ${
                activeTab === tab.toLowerCase().replace(/\s+/g, "")
                  ? "bg-[#070257] text-black scale-105 shadow-md"
                  : "bg-[#1F2833] hover:bg-[#0a0894] hover:scale-105 hover:shadow-lg"
              }`}
              onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, ""))}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Event Cards */}
        <div className="flex flex-col w-full h-5/6 items-center overflow-y-auto z-10">
          {isLoading ? (
            <div className="text-white">Loading...</div>
          ) : (
            selectedEvents.map((event) => (
              <EventCard
                key={event._id.toString()}
                _id={event._id.toString()}
                poster={event.poster}
                heading={event.heading}
                eventHostedBy={event.eventHostedBy}
                description={event.description}
                tags={event.tags}
                eventTime={event.eventTime}
                eventVenue={event.eventVenue}
                isInterested={event.isInterested}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-row items-center justify-between w-full md:w-1/3 h-20 text-white mt-4">
          <button
            onClick={() => page > 1 && setPage(page - 1)}
            className="text-sm md:text-lg font-bold h-10 md:h-12 px-4 md:px-8 bg-gradient-to-br from-[#0728f9] to-[#127b76] text-black rounded shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
          >
            Previous
          </button>
          <div className="text-white text-base md:text-xl font-semibold">{page}</div>
          <button
            onClick={() => page < maxPage && setPage(page + 1)}
            className="text-sm md:text-lg font-bold h-10 md:h-12 px-5 md:px-8 bg-gradient-to-br from-[#0d7c74] to-[#0f12a4] text-black rounded shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
          >
            Next
          </button>
        </div>
      </div>

      {/* Sidebar / Filter Box */}
      <div className="w-full md:w-1/5 flex flex-col items-center mt-4 md:mt-8">
        {/* Toggle Button for Mobile */}
        <button
          className="text-lg font-bold bg-gradient-to-br from-[#2a11e2] to-[#45A29E] text-black w-36 rounded mb-4 md:mb-8 hover:scale-105 transition-all md:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* FilterBox */}
        <div className="mt-6 w-half">
          {(showFilters || !showFilters) && (
            <FilterBox
              onFilterChange={(filters) => {
                setFilterCriteria(filters);
                setPage(1);
              }}
            />
          )}
        </div>

        {/* Add Event Button */}
        <button
          className="text-lg font-bold bg-gradient-to-br from-[#061083] to-[#45A29E] text-black w-36 rounded mt-6 hover:scale-105 transition-all"
          onClick={() => router.push("/events/add-event")}
        >
          Add Event
        </button>
      </div>
    </div>
  );
}
