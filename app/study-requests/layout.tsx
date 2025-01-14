"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Study Requests", href: "/study-requests", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "My Requests", href: "/study-requests/my-requests", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "My Requests to Teach", href: "/study-requests/my-requests-to-teach", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Add Request", href: "/study-requests/add-request", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Accepted Requests", href: "/study-requests/accepted-requests", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Accepted Requests to Teach", href: "/study-requests/accepted-requests-to-teach", color: "bg-blue-600 hover:bg-blue-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col">
      {/* Navigation Bar */}
      <div className="w-full py-4 bg-gray-950 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-white py-2 px-4 md:px-6 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
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
