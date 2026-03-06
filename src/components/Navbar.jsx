import { FaBell } from "react-icons/fa";

function Navbar() {
  return (
    <div className="w-full bg-gray-800 shadow-sm px-8 py-4 flex justify-between items-center">

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="w-80 px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <button className="relative text-gray-300 hover:text-indigo-400 transition">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="text-sm">
            <p className="font-semibold text-gray-100">Admin</p>
            <p className="text-gray-400 text-xs">Product Manager</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Navbar;