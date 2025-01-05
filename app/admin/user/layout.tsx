"use client"

import {usePathname, useRouter} from "next/navigation";

export default function Layout({ children }: Readonly<{children: React.ReactNode;}>) {
  const router = useRouter();
  const currentPath = usePathname()
  const isActive = (path: string) => currentPath === path;

  return (
    <>
      <div className="flex flex-col items-center w-full h-32 bg-gray-800">
        <div className="flex flex-row w-1/2 h-full justify-around items-center ">
          <button
            className={`h-14 w-48 rounded-full text-xl font-bold ${isActive("admin/user/make-admin") ? "bg-gray-950 text-white" : "bg-white text-gray-950"}`}
            onClick={()=> router.push("admin/user/make-admin")}
          >
            Make Admin
          </button>
          <button
            className={`h-14 w-48 rounded-full text-xl font-bold ${isActive("admin/user/make-teacher") ? "bg-gray-950 text-white" : "bg-white text-gray-950"}`}
            onClick={()=> router.push("admin/user/make-teacher")}
          >
            Make Teacher
          </button>
        </div>
      </div>
    {children}
    </>
  )
}