export default function Marks({type, marks}: { type: string, marks: string}) {

  return (
    <>
      <div className="flex flex-col items-center justify-around h-3/4 w-40 border-2 ml-6 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50 flex-shrink-0 text-lg">
        <div>
          {type}
        </div>
        <div>
          {marks}
        </div>
      </div>
    </>
  )
}