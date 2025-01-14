export default function StudentCard({
  name,
  student_id,
  profile,
}: {
  name: string;
  student_id: string;
  profile: string;
}) {
  return (
    <div className="flex flex-row items-center justify-start mt-5 p-4 w-full max-w-sm border-2 rounded-lg border-blue-800 bg-[#1E1E1E] sm:max-w-md md:max-w-lg lg:max-w-xl">
      <img
        src={profile || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"}
        alt="Student Profile"
        className="w-14 h-14 border-2 rounded-full border-blue-800 shadow-md shadow-blue-800/50"
      />
      <div className="flex flex-col ml-4 text-gray-300 w-full">
        <div className="text-lg font-semibold truncate">{name}</div>
        <div className="text-sm truncate">{student_id}</div>
      </div>
    </div>
  );
}
