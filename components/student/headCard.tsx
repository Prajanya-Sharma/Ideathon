interface Props {
  name: string;
  student_id: string;
  profile: string;
}

export default function HeadCard({ name, student_id, profile }: Props) {
  return (
    <div className="flex flex-row items-center justify-around m-5 p-6 w-full max-w-xl bg-gradient-to-b from-[#0B0C10] to-[#1F2833] border-2 rounded-xl border-cyan-300 shadow-lg shadow-cyan-300/50 flex-shrink-0">
      <img
        src={profile || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"}
        className="w-16 h-16 border-4 rounded-full border-cyan-300 shadow-md shadow-cyan-300/50"
        alt="Profile"
      />
      <div className="text-lg md:text-xl font-bold text-[#66FCF1] text-center">
        {name}
      </div>
      <div className="text-lg md:text-xl font-bold text-white text-center">
        {student_id}
      </div>
    </div>
  );
}