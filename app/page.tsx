import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-black text-white">
      {/* Navbar */}
      <nav className="bg-black bg-opacity-60 backdrop-blur-md p-4 fixed w-full z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">College Compass</div>
          <div className="space-x-4">
            <button className="bg-transparent text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"><a href="/sign-in">Sign In</a></button>
            <button className="bg-transparent text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"><a href="/sign-up">Sign Up</a></button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-16 sm:py-20 px-6 sm:px-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white">
          <span>Welcome to </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            College Compass
          </span>
        </h1>
        <p className="text-lg sm:text-xl mb-4">Your one-stop site for all your college resources</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-500 transition duration-300">
          <a href="/sign-in">Sign In to Explore</a>
        </button>
      </div>

      {/* Explore Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
        <h2 className="text-3xl text-center text-white mb-6">Explore Our Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 - Study Resources */}
          <div className="relative bg-white bg-opacity-20 p-6 rounded-lg shadow-lg overflow-hidden group hover:bg-blue-700 transition duration-300 ease-in-out">
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"></div>
            <h3 className="text-xl font-semibold text-white z-10 relative group-hover:text-blue-300">Study Resources</h3>
            <p className="text-sm mt-2 text-white z-10 relative opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
              Access all the materials you need to succeed in your college courses.
            </p>
          </div>

          {/* Card 2 - Events */}
          <div className="relative bg-white bg-opacity-20 p-6 rounded-lg shadow-lg overflow-hidden group hover:bg-blue-700 transition duration-300 ease-in-out">
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"></div>
            <h3 className="text-xl font-semibold text-white z-10 relative group-hover:text-blue-300">Events</h3>
            <p className="text-sm mt-2 text-white z-10 relative opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
              Stay updated with the latest college events, workshops, and activities.
            </p>
          </div>

          {/* Card 3 - Dashboard Profile */}
          <div className="relative bg-white bg-opacity-20 p-6 rounded-lg shadow-lg overflow-hidden group hover:bg-blue-700 transition duration-300 ease-in-out">
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"></div>
            <h3 className="text-xl font-semibold text-white z-10 relative group-hover:text-blue-300">Dashboard Profile</h3>
            <p className="text-sm mt-2 text-white z-10 relative opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
              Manage your personal profile, grades, and academic progress.
            </p>
          </div>

          {/* Card 4 - Connections */}
          <div className="relative bg-white bg-opacity-20 p-6 rounded-lg shadow-lg overflow-hidden group hover:bg-blue-700 transition duration-300 ease-in-out">
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"></div>
            <h3 className="text-xl font-semibold text-white z-10 relative group-hover:text-blue-300">Connections</h3>
            <p className="text-sm mt-2 text-white z-10 relative opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
              Connect with peers, professors, and alumni to expand your network.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black bg-opacity-60 text-center py-4 mt-12">
        <p className="text-white text-sm">© 2024 College Compass. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;