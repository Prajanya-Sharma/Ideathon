"use client";
import { useModel } from "../../../../hooks/user-model-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import DotsLoader from "@components/loading/dotLoader";

export default function AddFriendsPage() {
  const [id, setId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { addFriends, setAddFriends, setLoading } = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/add-friends`
        );
        if (res.status === 200) {
          setAddFriends(res.data.students);
          setId(res.data.id.toString());
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setAddFriends, setLoading, router]);

  if (!addFriends) {
    return <DotsLoader />;
  }

  async function addFriend(to: string) {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/add-friends/${id}/${to}`
      );
      if (res.status === 200) {
        setAddFriends(
          addFriends.filter((friend) => friend._id.toString() !== to)
        );
      }
    } catch (error) {
      console.error("Failed to add friend", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredFriends = addFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-auto">
      {/* Page Header */}
      {/* <div className="w-full py-10 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
          Add Friends
        </h1>
      </div> */}

      {/* Search Input */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by username or student ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-4/5 max-w-2xl p-4 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 mt-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Friends List */}
      <div className="flex flex-col items-center mt-8 px-4">
        {filteredFriends.length === 0 ? (
          <div className="text-gray-400 text-lg mt-20">
            No friends found matching your search.
          </div>
        ) : (
          <div className="w-full max-w-5xl max-h-[70vh]">
            {filteredFriends.map((friend) => (
              <div
                key={friend._id.toString()}
                className="flex flex-row w-full bg-gray-800 rounded-lg shadow-xl items-center justify-between p-6 my-4 hover:scale-105 transform transition-transform duration-300"
              >
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <img
                    src={friend.profile}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {friend.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {friend.student_id}
                    </div>
                  </div>
                </div>

                {/* Add Friend Button */}
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                  onClick={() => addFriend(friend._id.toString())}
                >
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}