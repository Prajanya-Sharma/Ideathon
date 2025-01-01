"use client";
import { useModel } from "../../../hooks/user-model-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import DotsLoader from "../../../components/loading/dotLoader";

export default function AddFriendsPage() {
  const [id, setId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { addFriends, setAddFriends, setLoading } = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/add-friends`);
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/add-friends/${id}/${to}`);
      if (res.status === 200) {
        setAddFriends(addFriends.filter((friend) => friend._id.toString() !== to));
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
    <>
      <div className="flex flex-col items-center h-screen w-full bg-gray-800">
        <input
          type="text"
          placeholder="Search by username or student ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 mt-8 p-4 rounded-lg text-gray-950"
        />
        {filteredFriends.map((friend) => (
          <div
            key={friend._id.toString()}
            className="flex flex-row w-1/2 h-24 bg-gray-950 mt-4 rounded-full items-center justify-around text-white text-lg font-bold"
          >
            <img src={friend.profile} className="w-16 h-16 rounded-full object-contain bg-white" />
            <div>{friend.name}</div>
            <div>{friend.student_id}</div>
            <button
              className="bg-white text-gray-950 h-14 w-36 rounded-full"
              onClick={() => addFriend(friend._id.toString())}
            >
              Add friend
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
