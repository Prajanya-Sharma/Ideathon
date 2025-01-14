import { useRouter } from "next/navigation";
export default function Logo() {
  const router = useRouter();

  const navigateToHome = () => {
    router.push("/");
  };

  return (
    <div
      onClick={navigateToHome}
      className="font-kaap-sam text-white font-bold cursor-pointer text-xl"
    >
      Campus Companion
    </div>
  );
}

//IF logo is available
//<div
//   style={{
//     backgroundColor: "white",
//     display: "inline-block",
//   }}
// >
{
  /* <Image 
        onClick={() => router.push("/")}
        alt="Logo"
        className="hidden md:block cursor-pointer"
        height="75"
        width="120"
        src="/images/logo.png"
      /> */
}

// </div>
