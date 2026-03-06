import React from 'react';
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import "./Dashboard.css";
import { FaUsers, FaPaperPlane, FaReply, FaChartLine } from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler);

function Dashboard() {
  // Premium Dark Theme Chart Config
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Hiding legend for a cleaner look
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { color: "rgba(30, 41, 59, 0.5)", drawBorder: false },
        ticks: { color: "#64748b", font: { family: 'Inter', size: 11 }, padding: 10 }
      }
    }
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Messages Sent",
      data: [200, 350, 500, 420, 600, 450, 300],
      backgroundColor: "rgba(99, 102, 241, 0.8)",
      hoverBackgroundColor: "#818cf8",
      borderRadius: 6,
      barThickness: 20,
    }]
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{
      label: "Conversion Rate",
      data: [4.2, 5.1, 6.8, 8.4],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderWidth: 3,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: "#0f172a",
      pointBorderColor: "#3b82f6",
      pointBorderWidth: 2,
      pointHoverRadius: 6,
      tension: 0.4
    }]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 pb-10">
      
      {/* Welcome Banner */}
      <div className="welcome-banner rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
        <div className="z-10">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome to AI Outreach Automation</h1>
          <p className="text-slate-400 text-sm lg:text-base max-w-xl">Configure intelligent workflows, upload your target leads, and monitor generative AI campaign performance in real-time.</p>
        </div>
        <div className="flex gap-4 z-10 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600/50 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg">
            Upload Leads
          </button>
          <button className="flex-1 md:flex-none bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
            Create Workflow
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard title="Total Leads" value="1,240" icon={<FaUsers />} className="animate-fade-in delay-100" />
        <StatCard title="Messages Sent" value="5,400" icon={<FaPaperPlane />} className="animate-fade-in delay-200" />
        <StatCard title="Replies" value="420" icon={<FaReply />} className="animate-fade-in delay-300" />
        <StatCard title="Conversion Rate" value="8.4%" icon={<FaChartLine />} className="animate-fade-in delay-300" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <ChartCard title="Outreach Activity Volume" className="animate-fade-in delay-200">
          <div className="h-[300px] w-full mt-4">
            <Bar data={barData} options={chartOptions} />
          </div>
        </ChartCard>
        <ChartCard title="Campaign Conversion Trends" className="animate-fade-in delay-300">
          <div className="h-[300px] w-full mt-4">
            <Line data={lineData} options={chartOptions} />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

export default Dashboard;