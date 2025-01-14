"use client";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "./Avatar";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCallback, useState } from "react";

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Prevent NextAuth's default redirect
    router.push('/sign-in'); // Redirect to sign-in page after signout completes
  };

  console.log(session);

  return (
    <div className="relative z-20 ml-4">
      <div className="flex flex-row items-center gap-3">
        <button
          onClick={() => router.push('/dashboard/student')}
          className="hidden md:block text-white text-sm font-semibold py-3 px-4 rounded-full hover:bg-blue-600 hover:text-white transition cursor-pointer"
        >
          {session?.user?.username || "Guest"}
        </button>
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition hover:scale-105 text-lg"
          aria-expanded={isOpen}
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar/>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="absolute rounded-xl shadow-md w-[50vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm"
        >
          <div className="flex flex-col cursor-pointer">
            {session ? (
              <>
                <button
                  onClick={handleSignOut}
                  className="py-2 px-4 text-black hover:bg-gray-200 text-left font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/sign-in")}
                  className="py-2 px-4 text-black hover:bg-gray-200 text-left font-bold"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/sign-up")}
                  className="py-2 px-4 text-black hover:bg-gray-200 text-left font-bold"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;