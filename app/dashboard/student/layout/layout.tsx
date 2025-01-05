'use client'
import React, { useState } from 'react';

const Layout = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0B0C10] to-[#1F2833]">
      {/* Navigation Dropdown Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-[#66FCF1] text-black px-4 py-2 rounded-full"
        >
          Like
        </button>
        {dropdownOpen && (
          <div className="absolute top-12 right-0 w-48 bg-[#0B0C10] border border-cyan-300 rounded-lg shadow-md">
            <ul className="space-y-2 p-2">
              <li className="text-[#66FCF1] hover:text-white cursor-pointer">Events</li>
              <li className="text-[#66FCF1] hover:text-white cursor-pointer">Map</li>
              <li className="text-[#66FCF1] hover:text-white cursor-pointer">Clubs</li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="text-2xl font-bold text-[#66FCF1] text-center mb-6">Main Content</div>
        {/* The rest of your layout content can go here */}
      </div>
    </div>
  );
}

export default Layout;
