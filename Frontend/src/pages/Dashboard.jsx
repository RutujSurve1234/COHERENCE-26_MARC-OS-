import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import "./Dashboard.css";
import { FaUsers, FaPaperPlane, FaReply, FaChartLine } from "react-icons/fa";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  PointElement, LineElement, ArcElement, Tooltip, Legend, Filler 
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

function Dashboard() {
  const navigate = useNavigate(); // 2. Initialize the hook

  // --- Premium Dark Theme Chart Config ---
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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

  const scoreData = {
    labels: ["High (70-100)", "Medium (40-70)", "Low (0-40)"],
    datasets: [{
      data: [320, 610, 320],
      backgroundColor: ["rgba(16, 185, 129, 0.9)", "rgba(99, 102, 241, 0.9)", "rgba(225, 29, 72, 0.9)"],
      borderWidth: 0,
      hoverOffset: 4
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
          
          {/* 3. Add onClick to route to leads page */}
          <button 
            onClick={() => navigate('/leads')}
            className="flex-1 md:flex-none bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600/50 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg"
          >
            Upload Leads
          </button>
          
          {/* 4. Add onClick to route to workflow builder */}
          <button 
            onClick={() => navigate('/workflows/builder')}
            className="flex-1 md:flex-none bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
          >
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

      {/* Top Charts Grid */}
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

      {/* Bottom Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        <ChartCard title="Lead Score Distribution" className="animate-fade-in delay-400">
          <div className="h-[300px] w-full mt-4 flex flex-col justify-between">
            <div className="relative flex-1 min-h-0">
              <Doughnut 
                data={scoreData} 
                options={{
                  responsive: true, 
                  maintainAspectRatio: false, 
                  cutout: '75%',
                  plugins: { legend: { display: false } }
                }} 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-white">1,240</span>
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Total</span>
              </div>
            </div>
            {/* Custom Legend */}
            <div className="w-full mt-6 space-y-3 px-2 shrink-0 pb-2">
              <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> High (70-100)</span> <span className="text-slate-300 font-bold">320 leads</span></div>
              <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div> Medium (40-70)</span> <span className="text-slate-300 font-bold">610 leads</span></div>
              <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> Low (0-40)</span> <span className="text-slate-300 font-bold">310 leads</span></div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="System Activity Feed" className="animate-fade-in delay-500">
          <div className="h-[300px] w-full mt-4 overflow-y-auto pr-4 space-y-6 custom-scrollbar text-left">
            
            <div className="flex gap-4">
              <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] shrink-0"></div>
              <div><p className="text-sm text-slate-300"><span className="font-bold text-white">Lead John Smith</span> added to system.</p><p className="text-xs text-slate-500 mt-0.5">2 mins ago</p></div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] shrink-0"></div>
              <div><p className="text-sm text-slate-300">Email sent to <span className="font-bold text-white">Acme Corp</span>.</p><p className="text-xs text-slate-500 mt-0.5">14 mins ago</p></div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)] shrink-0"></div>
              <div><p className="text-sm text-slate-300"><span className="font-bold text-white">Lead Sarah</span> replied to outreach.</p><p className="text-xs text-slate-500 mt-0.5">1 hour ago</p></div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] shrink-0"></div>
              <div><p className="text-sm text-slate-300">Workflow <span className="font-bold text-white">SaaS Outreach</span> executed step 3.</p><p className="text-xs text-slate-500 mt-0.5">2 hours ago</p></div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] shrink-0"></div>
              <div><p className="text-sm text-slate-300"><span className="font-bold text-emerald-400">Lead converted</span> to customer!</p><p className="text-xs text-slate-500 mt-0.5">Yesterday</p></div>
            </div>

          </div>
        </ChartCard>

      </div>

    </div>
  );
}

export default Dashboard;