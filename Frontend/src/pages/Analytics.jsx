import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { FaShieldAlt, FaRobot, FaUserCheck, FaClock } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';

const Analytics = () => {
  // meaningful PS data: Behavioral Delay simulation (Human-like behavior)
  const delayData = [
    { time: '09:00', delay: 120 }, { time: '10:00', delay: 450 },
    { time: '11:00', delay: 300 }, { time: '12:00', delay: 600 },
    { time: '13:00', delay: 150 }, { time: '14:00', delay: 420 },
  ];

  // Lead progression through the automated workflow
  const funnelData = [
    { name: 'Imported', value: 1240, color: '#6366f1' },
    { name: 'AI Researched', value: 980, color: '#818cf8' },
    { name: 'Sent', value: 640, color: '#a5b4fc' },
    { name: 'Replied', value: 420, color: '#c7d2fe' },
  ];

  return (
    /* h-screen and overflow-hidden prevent the page from growing indefinitely */
    <div className="h-screen overflow-hidden flex flex-col bg-[#0f172a] text-slate-200">
      
      {/* Content Area - Scrollable internally if needed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-white">System Intelligence</h1>
            <p className="text-slate-400">Real-time monitoring of AI outreach sequences and behavioral safety.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
              Export Audit Log
            </button>
          </div>
        </div>

        {/* High-Impact Stat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Safety Status" value="Secure" icon={<FaShieldAlt className="text-emerald-400"/>} subtext="Anti-throttling active" />
          <StatCard title="AI Precision" value="98.4%" icon={<FaRobot className="text-indigo-400"/>} subtext="Personalization accuracy" />
          <StatCard title="Lead Progression" value="74%" icon={<FaUserCheck className="text-blue-400"/>} subtext="Conversion velocity" />
          <StatCard title="Wait Variance" value="4.2m" icon={<FaClock className="text-amber-400"/>} subtext="Human-like behavior sim" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <ChartCard title="Outreach Progression Funnel" description="Tracking lead movement through automated stages.">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Behavioral Throttling (Safety)" description="Randomized interval simulation to ensure compliant automation.">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={delayData}>
                <defs>
                  <linearGradient id="colorDelay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="delay" stroke="#6366f1" fillOpacity={1} fill="url(#colorDelay)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Secondary Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1e293b] rounded-xl p-5 border border-slate-800">
            <h3 className="font-bold text-lg mb-4">Live Execution Intelligence</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-sm font-medium">Lead #{1042 + i} processed via AI research module</span>
                  </div>
                  <span className="text-xs text-slate-500">Wait: 14m 22s applied</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#1e293b] rounded-xl p-5 border border-slate-800 flex flex-col items-center justify-center">
             <h3 className="font-bold text-lg mb-2 self-start">Sentiment Analysis</h3>
             <p className="text-xs text-slate-400 self-start mb-4">Lead response categorization</p>
             <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400">82%</div>
                <div className="text-sm text-slate-400">Positive Intent</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;