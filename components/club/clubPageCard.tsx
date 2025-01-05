"use client"
import mongoose from "mongoose";
import {useRouter} from "next/navigation";

interface props {
  _id: string,
  clubLogo: string,
  clubName: string,
}

export default function ClubPageCard({_id, clubLogo, clubName}: props) {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row items-center justify-between w-2/5 h-32 flex-shrink-0 mt-6 ml-8 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
        <img
          src={clubLogo || "https://india.acm.org/images/acm_rgb_grad_pos_diamond.png"}
          alt=''
          className="h-20 w-20 object-cover rounded-full ml-4"
        />
        <div className="text-2xl font-bold">
          {clubName}
        </div>
        <button
          className="text-xl font-bold h-1/2 bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-1/3 rounded-3xl mr-4"
          onClick={()=> router.push(`/clubs/${_id}`)}
        >
          Show Club Details
        </button>
      </div>
    </>
  )
}