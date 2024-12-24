"use client"
import HeadCard from "../../../components/student/headCard";
import SmallEventCard from "../../../components/events/smallCard";
import StudentCard from "../../../components/student/studentCard";
import {redirect} from "next/navigation";

export default function Club() {


  return (
    <>
      <div className="flex flex-col items-center h-screen">
        <div className="flex flex-row items-center w-4/5 h-1/3 mt-12 justify-between ">
          <div className="flex flex-col w-3/5 h-full ">
            <div className="text-3xl font-bold">
              Club Name
            </div>
            <div className="text-2xl mt-6 mb-3 font-bold">
              Secy
            </div>
            <div className="flex flex-col h-4/6 w-4/5 pl-4 justify-evenly border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
              {/*<HeadCard />*/}
              {/*<HeadCard />*/}
            </div>
          </div>
          <img
            src="https://india.acm.org/images/acm_rgb_grad_pos_diamond.png" className="h-72 w-72 object-cover rounded-full" />
        </div>
        <div className="flex flex-row justify-between h-1/2 w-4/5 mt-10 ">
          <div className="flex flex-col w-3/5 h-full justify-between ">
            <div className="flex flex-row justify-between items-center">
              <div className="text-3xl font-bold mb-4">
                Events
              </div>
              <button
                className="text-xl font-bold h-4/5 bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-1/4 rounded-3xl mr-4"
                onClick={() => {redirect("/events")}}
              >
                Show All Events
              </button>
            </div>
            <div className="flex flex-col w-full h-full mt-2 overflow-y-auto scroll-p-2 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
              {/*<SmallEventCard />*/}
              {/*<SmallEventCard />*/}
              {/*<SmallEventCard />*/}
              {/*<SmallEventCard />*/}
              {/*<SmallEventCard />*/}
              {/*<SmallEventCard />*/}
            </div>
          </div>
          <div className="flex flex-col items-center w-1/4 h-full overflow-y-auto scroll-m-2 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
            <div className="text-3xl font-bold mt-2">
              Members
            </div>
            {/*<StudentCard student_id={"23242"} name={"name"} profile={""}/>*/}
            {/*<StudentCard student_id={"23242"} name={"name"} profile={""}/>*/}
            {/*<StudentCard student_id={"23242"} name={"name"} profile={""}/>*/}
            {/*<StudentCard student_id={"23242"} name={"name"} profile={""}/>*/}
            {/*<StudentCard student_id={"23242"} name={"name"} profile={""}/>*/}
            {/*<StudentCard student_id={"23242"} name={"name"} profile={""}/>*/}
            {/*<StudentCard student_id={"23242"} name={"name"} profile={""}/>*/}
          </div>
        </div>
      </div>
    </>
  )
}