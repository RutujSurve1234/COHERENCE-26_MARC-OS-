import React, { useState, useEffect, useRef } from "react";
import { 
  FaBell, FaSearch, FaUser, FaCog, FaSignOutAlt, 
  FaCheckCircle, FaExclamationTriangle, FaEnvelopeOpenText, FaRegBellSlash
} from "react-icons/fa";

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Simulated Notification State
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', title: "Meeting Booked!", desc: "Alice Freeman just booked a discovery call.", time: "2 mins ago", icon: FaCheckCircle, color: "emerald" },
    { id: 2, type: 'warning', title: "Workflow Paused", desc: "Startup Leads hit its daily sending limit.", time: "1 hr ago", icon: FaExclamationTriangle, color: "amber" },
    { id: 3, type: 'info', title: "High Intent Reply", desc: "Marcus Johnson replied positively.", time: "3 hrs ago", icon: FaEnvelopeOpenText, color: "blue" },
  ]);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications([]);
  };

  const getColorClasses = (color) => {
    const map = {
      emerald: "text-emerald-400 bg-emerald-500/10",
      amber: "text-amber-400 bg-amber-500/10",
      blue: "text-blue-400 bg-blue-500/10"
    };
    return map[color] || "text-slate-400 bg-slate-800";
  };

  return (
    <div className="h-20 sticky top-0 z-30 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/60 px-6 lg:px-8 flex justify-between items-center transition-all">
      
      {/* Search Bar - Expands subtly on focus */}
      <div className={`relative hidden sm:block transition-all duration-300 ${isSearchFocused ? 'w-96' : 'w-80'}`}>
        <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-indigo-400' : 'text-slate-500'}`} />
        <input
          type="text"
          placeholder="Search campaigns, leads..."
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="w-full pl-11 pr-12 py-2.5 bg-slate-900/50 hover:bg-slate-900/80 text-sm text-slate-200 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all placeholder:text-slate-500 shadow-inner"
        />
        {/* Pro Keyboard Shortcut Hint */}
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded flex items-center justify-center pointer-events-none transition-opacity ${isSearchFocused ? 'opacity-0' : 'opacity-100'}`}>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 shadow-sm">/</span>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4 lg:gap-6 ml-auto">
        
        {/* ==========================================
            NOTIFICATION BELL & DROPDOWN
        ========================================== */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`relative p-2.5 transition-all rounded-full ${showNotifications ? 'bg-slate-800 text-indigo-400 shadow-inner' : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50'}`}
          >
            <FaBell size={18} className={notifications.length > 0 ? "animate-pulse-slow" : ""} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)] border-2 border-[#020617]"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-4 w-[340px] bg-[#090f1e] border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden z-50 animate-fade-in origin-top-right">
              <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">Notifications</h3>
                  {notifications.length > 0 && (
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-bold">{notifications.length}</span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button onClick={handleMarkAllRead} className="text-[11px] font-semibold text-slate-400 hover:text-indigo-400 transition-colors">Mark all read</button>
                )}
              </div>
              
              <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
                      <FaRegBellSlash className="text-xl text-slate-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-300 mb-1">All caught up!</p>
                    <p className="text-xs text-slate-500">No new alerts or system messages.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors cursor-pointer flex gap-3 group">
                      <div className={`mt-0.5 p-2 rounded-full h-fit border border-transparent group-hover:border-${notif.color}-500/30 transition-colors ${getColorClasses(notif.color)}`}>
                        <notif.icon size={12} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200 mb-0.5 group-hover:text-indigo-300 transition-colors">{notif.title}</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed pr-2">{notif.desc}</p>
                        <p className="text-[9px] text-slate-500 mt-1.5 font-semibold uppercase tracking-wider">{notif.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="p-3 border-t border-slate-800 bg-slate-900/50 text-center">
                  <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors w-full py-1">View All Activity</button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-slate-800/80 hidden sm:block"></div>

        {/* ==========================================
            PROFILE & DROPDOWN
        ========================================== */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 cursor-pointer group p-1 pr-2 rounded-full hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-700/50"
          >
            <div className="text-right hidden md:block">
              <p className="font-bold text-[13px] text-slate-200 group-hover:text-white transition-colors leading-tight">Admin Operator</p>
              <p className="text-[10px] font-medium text-slate-500">System Architect</p>
            </div>
            <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-[0_0_15px_rgba(79,70,229,0.3)] group-hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-shadow">
              <img src="https://i.pravatar.cc/100?img=11" alt="profile" className="w-full h-full rounded-full border-2 border-[#020617] object-cover" />
            </div>
          </div>

          {/* Expanded Profile Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-4 w-60 bg-[#090f1e] border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden z-50 animate-fade-in origin-top-right">
              
              {/* User Identity Header */}
              <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/50">
                <p className="text-sm font-bold text-white mb-0.5">Admin Operator</p>
                <p className="text-[11px] text-slate-400 truncate">admin@coherence.ai</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] uppercase font-bold tracking-wider">Pro Plan</span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="py-2">
                <button className="w-full flex items-center gap-3 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors group">
                  <FaUser className="text-slate-500 group-hover:text-indigo-400 transition-colors" /> My Profile
                </button>
                <button className="w-full flex items-center gap-3 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors group">
                  <FaCog className="text-slate-500 group-hover:text-indigo-400 transition-colors" /> Workspace Settings
                </button>
                
                <div className="my-1.5 border-t border-slate-800/60"></div>
                
                <button className="w-full flex items-center gap-3 px-5 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors">
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;