import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import "./Dashboard.css";

import { FaUsers, FaPaperPlane, FaReply, FaChartLine } from "react-icons/fa";

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function Dashboard() {

  const barData = {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets: [
      {
        label: "Messages Sent",
        data: [200, 350, 500, 420, 600, 450, 300],
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "#2563eb"
      }
    ]
  };

  const lineData = {
    labels: ["Week 1","Week 2","Week 3","Week 4"],
    datasets: [
      {
        label: "Campaign Performance",
        data: [30, 45, 60, 75],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="dashboard-container space-y-6">

      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Welcome to AI Outreach Automation</h1>
          <p>Manage leads, campaigns and outreach automation.</p>
        </div>

        <div className="button-group">
          <button className="btn btn-primary">
            Upload Leads
          </button>
          <button className="btn btn-secondary">
            Create Workflow
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <StatCard
          title="Total Leads"
          value="1,240"
          icon={<FaUsers />}
        />
        <StatCard
          title="Messages Sent"
          value="5,400"
          icon={<FaPaperPlane />}
        />
        <StatCard
          title="Replies"
          value="420"
          icon={<FaReply />}
        />
        <StatCard
          title="Conversion Rate"
          value="8.4%"
          icon={<FaChartLine />}
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <ChartCard title="Outreach Activity">
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: true }} />
        </ChartCard>
        <ChartCard title="Campaign Performance">
          <Line data={lineData} options={{ responsive: true, maintainAspectRatio: true }} />
        </ChartCard>
      </div>

    </div>
  );
}

export default Dashboard;