export default function ClubCard() {

  return (
    <>
      <div
        className="flex flex-row items-center justify-between w-4/5 h-1/4 ml-8 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
        <img
          src="https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75"
          alt=""
          className="h-20 w-20 object-cover rounded-full ml-4"
        />
        <div className="text-2xl font-bold">
          Club Name
        </div>
        <div className="text-2xl font-bold mr-4">
          Club Category
        </div>
        <button className="text-xl font-bold h-1/2 bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-1/4 rounded-3xl mr-4">
          Show Club Details
        </button>
      </div>
    </>
  )
}