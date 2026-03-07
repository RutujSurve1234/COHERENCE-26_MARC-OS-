import { NavLink } from "react-router-dom";
import { FaChartPie, FaUsers, FaProjectDiagram, FaPaperPlane, FaChartLine, FaCog } from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaChartPie />, path: "/dashboard" },
  { name: "Leads", icon: <FaUsers />, path: "/leads" },
  { name: "Workflows", icon: <FaProjectDiagram />, path: "/workflows" },
  { name: "Campaigns", icon: <FaPaperPlane />, path: "/campaigns" },
  { name: "Analytics", icon: <FaChartLine />, path: "/analytics" },
  
  
];

function Sidebar() {
  return (
    <div className="h-full bg-slate-900 flex flex-col">
      
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
        <span className="text-xl font-bold text-white tracking-wide">
          Coherence AI
        </span>
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
    </div>
  );
}

export default Sidebar;