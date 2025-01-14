import { useRouter } from "next/navigation";
import Image from "next/image";

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
      <div
        style={{
          display: "inline-block",
        }}
      >
        <Image
          src="/images/logo.png" 
          alt="Logo"
          width={240} // Set the width
          height={60} // Set the height
          priority 
        />
      </div>
    </div>
  );
}
