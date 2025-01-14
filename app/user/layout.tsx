"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Friends", href: "/user/friends", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Add Friends", href: "/user/add-friends", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Friend Requests", href: "/user/friend-requests", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Requests Sent", href: "/user/requests-sent", color: "bg-blue-600 hover:bg-blue-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col">
      {/* Navigation Bar */}
      <div className="w-full py-4 bg-gray-950 shadow-lg text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
                pathname === item.href
                  ? `${item.color} shadow-md`
                  : `${item.color.split(" ")[1]}`
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <main className="flex-grow">{children}</main>
    </div>
  );
}
