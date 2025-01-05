"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const currentPath = usePathname();
  const isActive = (path: string) => currentPath === path;

  return (
    <>
      {/* Navigation Bar */}
      <div className="w-full bg-gray-950 py-4 shadow-md">
        <div className="flex justify-around items-center max-w-5xl mx-auto">
          <button
            className={`px-6 py-3 text-lg font-bold rounded-full transition-all duration-300 ${
              isActive("/user/friends")
                ? "bg-blue-700 text-white shadow-lg"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => router.push("/user/friends")}
          >
            Friends
          </button>
          <button
            className={`px-6 py-3 text-lg font-bold rounded-full transition-all duration-300 ${
              isActive("/user/add-friends")
                ? "bg-blue-700 text-white shadow-lg"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => router.push("/user/add-friends")}
          >
            Add Friends
          </button>
          <button
            className={`px-6 py-3 text-lg font-bold rounded-full transition-all duration-300 ${
              isActive("/user/friend-requests")
                ? "bg-blue-700 text-white shadow-lg"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => router.push("/user/friend-requests")}
          >
            Friend Requests
          </button>
          <button
            className={`px-6 py-3 text-lg font-bold rounded-full transition-all duration-300 ${
              isActive("/user/requests-sent")
                ? "bg-blue-700 text-white shadow-lg"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => router.push("/user/requests-sent")}
          >
            Requests Sent
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen">
        {children}
      </main>
    </>
  );
}
