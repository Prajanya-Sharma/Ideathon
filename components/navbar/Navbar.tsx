"use client";

import Categories from "./Categories";
import Logo from "./Logo";
import UserMenu from "./UserMenu";

interface NavbarProps {}
const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white p-6 sticky top-0 z-10">
      <div
        className="flex
        flex-row
        items-center
        justify-between
        gap-3
        md:gap-0"
      >
        <Logo />
        <UserMenu />
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
