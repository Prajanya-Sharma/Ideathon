"use client";

import { useState } from "react";

export default function FilterBox({ onFilterChange }: { onFilterChange: (filters: string[]) => void }) {
  const filterOptions = ["Tech", "Coding", "Robotics", "Music", "Dance", "Art", "Comedy"];
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, filter: string) => {
    const isChecked = e.target.checked;
    let updatedFilters = [...selectedFilters];
    if (isChecked) {
      updatedFilters.push(filter);
    } else {
      updatedFilters = updatedFilters.filter((item) => item !== filter);
    }
    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="flex flex-col flex-shrink-0 w-half p-6 m-5 border border-blue-900 rounded-sm bg-[#3940481f] transition-all duration-300">
      {/* Filter Box Header */}
      <div className="text-lg font-semibold text-center mb-4 text-gray-300">
        Filter Options
      </div>

      {/* Filter Options */}
      <div className="flex flex-col gap-3">
        {filterOptions.map((filter) => (
          <div
            key={filter}
            className="text-base font-medium flex flex-row items-center w-full text-gray-300"
          >
            <label className="inline-flex items-center cursor-pointer">
              {/* Custom Checkbox */}
              <input
                type="checkbox"
                className="hidden peer"
                onChange={(e) => handleChange(e, filter)}
              />
              <div className="w-5 h-5 border border-blue-900 rounded-sm peer-checked:bg-blue-600 peer-checked:border-blue-700 transition-all duration-200"></div>
            </label>
            {/* Filter Label */}
            <div className="ml-3">{filter}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
