import { FaBell, FaSearch } from "react-icons/fa";

function Navbar() {
  return (
    <div className="h-20 sticky top-0 z-30 w-full bg-[#020617]/80 backdrop-blur-md border-b border-slate-800/60 px-8 flex justify-between items-center transition-all">
      
      {/* Search Bar */}
      <div className="relative group">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
        <input
          type="text"
          placeholder="Search campaigns, leads..."
          className="w-80 pl-11 pr-4 py-2.5 bg-slate-900/50 text-sm text-slate-200 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-500 shadow-inner"
        />
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-6">
        
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-800/50">
          <FaBell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)] border-2 border-[#020617]"></span>
        </button>

        <div className="w-px h-8 bg-slate-800/60"></div>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="font-semibold text-sm text-slate-200 group-hover:text-indigo-300 transition-colors">Admin Operator</p>
            <p className="text-xs text-slate-500">System Architect</p>
          </div>
          <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-blue-500">
            <img src="https://i.pravatar.cc/100?img=11" alt="profile" className="w-full h-full rounded-full border-2 border-[#020617] object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;