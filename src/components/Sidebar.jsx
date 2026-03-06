import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaProjectDiagram,
  FaPaperPlane,
  FaChartLine,
  FaCog,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaChartPie />, path: "/" },
  { name: "Leads", icon: <FaUsers />, path: "/leads" },
  { name: "Workflows", icon: <FaProjectDiagram />, path: "/workflows" },
  { name: "Campaigns", icon: <FaPaperPlane />, path: "/campaigns" },
  { name: "Analytics", icon: <FaChartLine />, path: "/analytics" },
  { name: "Settings", icon: <FaCog />, path: "/settings" },
];

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-gray-300 flex flex-col">

      {/* Logo */}
      <div className="text-white text-2xl font-bold px-6 py-6 border-b border-gray-800">
        Coherence AI
      </div>

      {/* Menu */}
      <div className="flex flex-col mt-4 space-y-2 px-3">

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}

      </div>
    </div>
  );
}

export default Sidebar;