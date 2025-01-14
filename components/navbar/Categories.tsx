import { usePathname } from "next/navigation";
import CategoryBox from "./CategoryBox";
import { useState } from "react";

export const categories = [
  {
    label: "Home",
  },
  {
    label: "Events",
  },
  {
    label: "Map",
  },
  {
    label: "Clubs",
  },
  {
    label: "Issues",
  },
  {
    label: "Friends",
  },
  {
    label: "Study-Requests"
  },
  {
    label: "Resources"
  }
];

function Categories() {
  const pathname = usePathname();

  const [selectedCategory, setSelectedCategory] = useState(
    pathname.replace("/", "") || "/"
  ); //after home page add home

  const handleCategoryClick = (label: string) => {
    setSelectedCategory(label.toLowerCase());
  };

  return (
    <div
      className="max-w-[2520px]
    mx-auto
    xl:px-20
    md:px-10
    sm:px-2
    px-4"
    >
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto font-archivo">
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            selected={selectedCategory === item.label.toLowerCase()}
            onClick={() => handleCategoryClick(item.label)}
          />
        ))}
      </div>
    </div>
  );
}

export default Categories;
