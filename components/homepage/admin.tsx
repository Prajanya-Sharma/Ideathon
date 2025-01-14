import {router} from "next/client";

export default function AdminHomePage() {
  const adminFeatures = [
    { name: "Add Clubs", description: "Create and manage student clubs.", color: "bg-blue-600", hover: "hover:bg-blue-700", func: ()=> router.push("/admin/clubs/add-club") },
    { name: "Assign Subjects", description: "Assign subjects to teachers and students.", color: "bg-green-600", hover: "hover:bg-green-700", func: ()=> router.push("/admin/subjects/students") },
    { name: "Add Announcements", description: "Broadcast important updates to everyone.", color: "bg-yellow-600", hover: "hover:bg-yellow-700", func: ()=> router.push("/admin/announcements/add") },
    { name: "Manage Roles", description: "Promote users to Admin, Teacher, or Student roles.", color: "bg-red-600", hover: "hover:bg-red-700", func: ()=> router.push("/admin/user/make-admin") },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <section className="max-w-7xl mx-auto pt-10 px-4 space-y-16">
        <h2 className="text-4xl font-bold text-blue-400 text-center mb-8">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminFeatures.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg ${feature.color} ${feature.hover} text-white`}
              onClick={feature.func}
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
