'use client';
import EventCard from "../../components/events/card";
import FilterBox from "../../components/events/filterbox";
import { useEffect, useState, useMemo } from "react";
import { useModel } from "../../hooks/user-model-store";
import axios from "axios";
import { useRouter } from "next/navigation";
import NavigatorButton from "../../components/general/navigator";
import { FaFilter, FaCalendarPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
        const response = await axios.get(`/api/events`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-400 mb-4 md:mb-0 font-archivo">Event Dashboard</h1>
            <div className="flex space-x-4">
              {/* <button
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all duration-300"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="text-yellow-400" />
                <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
              </button> */}
              <button
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-300"
                onClick={() => router.push("/events/add-event")}
              >
                <FaCalendarPlus className="text-white" />
                <span>Add Event</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center space-x-4">
            {["All", "Interested", "Not Interested"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.toLowerCase().replace(/\s+/g, "")
                    ? "bg-blue-600 text-white scale-105 shadow-lg"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                }`}
                onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, ""))}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Section */}
          <div className={`md:w-1/4 transition-all duration-300 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-gray-800 rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Filters</h2>
              <FilterBox
                onFilterChange={(filters) => {
                  setFilterCriteria(filters);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Events Section */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No events found</div>
              ) : (
                <div className="space-y-6">
                  {selectedEvents.map((event) => (
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
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-center space-x-6 mt-8">
                <button
                  onClick={() => page > 1 && setPage(page - 1)}
                  disabled={page === 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    page === 1
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } transition-all duration-300`}
                >
                  <FaChevronLeft />
                  <span>Previous</span>
                </button>
                <span className="text-lg font-semibold bg-gray-700 px-4 py-2 rounded-lg">
                  {page} / {maxPage || 1}
                </span>
                <button
                  onClick={() => page < maxPage && setPage(page + 1)}
                  disabled={page >= maxPage}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    page >= maxPage
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } transition-all duration-300`}
                >
                  <span>Next</span>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}