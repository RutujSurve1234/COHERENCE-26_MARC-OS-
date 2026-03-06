import { FaUsers, FaPaperPlane, FaReply, FaChartLine } from "react-icons/fa";
import "./StatCard.css";
function StatCard({ title, value, icon }) {

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex items-center justify-between">

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>

      <div className="text-indigo-500 text-2xl">
        {icon}
      </div>

    </div>
  );
}

export default StatCard;