import {router} from "next/client";

export default function TeacherHomePage() {
  const teacherFeatures = [
    { name: "Make Announcements", description: "Share updates with your class.", color: "bg-emerald-600", hover: "hover:bg-emerald-700", func: ()=> router.push("/teacher/announcements/add") },
    { name: "Add Resources", description: "Upload materials for students.", color: "bg-purple-600", hover: "hover:bg-purple-700", func: ()=> router.push("/teacher/subjects") },
    { name: "Create Attendance Group", description: "Organize students into attendance groups.", color: "bg-orange-600", hover: "hover:bg-orange-700", func: ()=> router.push("/teacher/subjects") },
    { name: "Take Attendance", description: "Mark student attendance.", color: "bg-teal-600", hover: "hover:bg-teal-700", func: ()=> router.push("/teacher/subjects") },
    { name: "Upload Marks", description: "Submit student grades for exams.", color: "bg-pink-600", hover: "hover:bg-pink-700", func: ()=> router.push("/teacher/marks") },
    { name: "View Attendance", description: "Review attendance records.", color: "bg-cyan-600", hover: "hover:bg-cyan-700", func: ()=> router.push("/teacher/subjects") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <section className="max-w-7xl mx-auto pt-10 px-4 space-y-16">
        <h2 className="text-4xl font-bold text-blue-400 text-center mb-8">Teacher Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teacherFeatures.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg ${feature.color} ${feature.hover} text-white`}
            >
              <h3 className="text-xl font-semibold">{feature.name}</h3>
              <p className="mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
