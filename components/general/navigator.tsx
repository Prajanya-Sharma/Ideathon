"use client";

import { useState } from "react";
import Link from "next/link";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavigatorButtonProps {
  buttonText: string;
  dropdownItems: DropdownItem[];
}

export default function NavigatorButton({ buttonText, dropdownItems }: NavigatorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative inline-block text-left">
      {/* Button */}
      <button
        onClick={toggleDropdown}
        className="text-lg font-semibold bg-gradient-to-br from-blue-900 to-cyan-800 text-gray-300 hover:text-white hover:bg-gradient-to-br hover:from-gray-600 hover:to-gray-500 transition duration-300 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {buttonText}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-gray-900 text-gray-400 font-bold border border-blue-900 shadow-lg rounded z-10">
          {dropdownItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-white transition duration-200"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
