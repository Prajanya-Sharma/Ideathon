export default function Tag({tag}: {tag: string}) {

  return (
    <>
      <div className="ml-6 w-1/6 h-3/5 content-center font-bold rounded-2xl text-center bg-gradient-to-br from-cyan-600 to-cyan-400 text-white">
        {tag}
      </div>
    </>
  )
}