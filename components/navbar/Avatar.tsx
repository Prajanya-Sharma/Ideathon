import React from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
function Avatar() {
  return (
    <div>
      {/* <Image
        className="rounded-full"
        height="30"
        width="30"
        alt="Avatar"
        src=""
      /> */}
      <FaUserCircle />
    </div>
    //Get user info and store the user icon in place of src
  );
}

export default Avatar;
