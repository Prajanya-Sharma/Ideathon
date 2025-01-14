"use client";

import {useSession} from "next-auth/react";
import AdminHomePage from "@/components/homepage/admin";
import TeacherHomePage from "@/components/homepage/teacher";
import StudentHomePage from "@/components/homepage/student";

export default function HomePage() {
  const session= useSession();

  if (session.data && !session.data.user.isStudent) {
    if (session.data.user.isAdmin) {
      return (
        <AdminHomePage />
      )
    } else if (session.data.user.isTeacher) {
      return (
        <TeacherHomePage />
      )
    } else {
      return (
        <>
          <div>
            wait for admin verification
          </div>
        </>
      )
    }
  }

  return <StudentHomePage />
}
