"use client";

import Categories from "./Categories";
import Logo from "./Logo";
import UserMenu from "./UserMenu";

interface NavbarProps {}
const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <div className="bg-black text-white p-4 sticky top-0 z-10 border-b-2 border-blue-500">
      <div
        className="flex
        flex-row
        items-center
        justify-between
        gap-3
        md:gap-0"
      >
        <div className="flex flex-row px-8 items-center gap-3">
        <Logo /> </div>
        <UserMenu />
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
