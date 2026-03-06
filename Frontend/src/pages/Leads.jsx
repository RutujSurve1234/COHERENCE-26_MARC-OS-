import React, { useState } from 'react';
import { 
  FaSearch, FaFilter, FaCloudUploadAlt, FaEllipsisH, 
  FaUserPlus, FaFire, FaBullseye, FaTags
} from "react-icons/fa";
import StatCard from '../components/StatCard';
import LeadProfile from './LeadProfile'; // IMPORT THE NEW DRAWER HERE

function Leads() {
  // Add state to track which lead was clicked
  const [selectedLead, setSelectedLead] = useState(null);

  const [leads] = useState([
    { 
      id: 1, 
      name: "Alice Freeman", 
      company: "TechCorp Industries", 
      status: "Qualified", 
      aiScore: 98, 
      tags: ["Enterprise", "High Intent"],
      lastActivity: "Opened Email: 'Scaling Infrastructure'", 
      timestamp: "10 mins ago",
      avatarColor: "from-emerald-400 to-teal-500"
    },
    { 
      id: 2, 
      name: "Marcus Johnson", 
      company: "Global Nexus AI", 
      status: "Contacted", 
      aiScore: 85, 
      tags: ["SaaS", "Follow-up"],
      lastActivity: "Automated Workflow Step 2 Triggered", 
      timestamp: "2 hours ago",
      avatarColor: "from-indigo-400 to-blue-500"
    },
    { 
      id: 3, 
      name: "Sarah Davis", 
      company: "Innovate Financial", 
      status: "New", 
      aiScore: 92, 
      tags: ["FinTech", "Inbound"],
      lastActivity: "Lead Scored via AI Engine", 
      timestamp: "Just now",
      avatarColor: "from-amber-400 to-orange-500"
    }
  ]);

  const renderStatus = (status) => {
    const styles = {
      'Qualified': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'Contacted': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'New': 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    };
    return (
      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in pb-12 relative">
      
      {/* 1. Lead Overview Dashboard (Remains unchanged) */}
      <div>
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Lead Management</h1>
            <p className="text-slate-400 text-sm mt-1">Overview, segmentation, and pipeline health.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <FaCloudUploadAlt size={18} />
            Import / Sync Leads
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Active Leads" value="3,421" icon={<FaBullseye />} className="h-28" />
          <StatCard title="New This Week" value="142" icon={<FaUserPlus />} className="h-28" />
          <StatCard title="High Intent" value="89" icon={<FaFire className="text-orange-400"/>} className="h-28" />
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-center">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pipeline Health</p>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-purple-500 w-1/4" title="New"></div>
              <div className="bg-blue-500 w-2/4" title="Contacted"></div>
              <div className="bg-emerald-500 w-1/4" title="Qualified"></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-medium">
              <span>New (25%)</span>
              <span>In Campaign (50%)</span>
              <span>Qualified (25%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lead List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-900/50">
           {/* ... filters remain the same ... */}
           <div className="relative flex-1 max-w-sm group">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input type="text" placeholder="Search leads..." className="w-full pl-9 pr-4 py-2 bg-slate-950/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-500" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700"><FaFilter /> More Filters</button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">AI Score</th>
                <th className="px-6 py-4">Segmentation Tags</th>
                <th className="px-6 py-4">Latest Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-slate-800/60 transition-colors group cursor-pointer"
                  onClick={() => setSelectedLead(lead)} // <--- TRIGGER DRAWER HERE
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${lead.avatarColor} p-0.5`}>
                        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs">{lead.name.charAt(0)}</div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{lead.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{lead.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{renderStatus(lead.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${lead.aiScore > 90 ? 'bg-indigo-500' : 'bg-slate-500'}`} style={{ width: `${lead.aiScore}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-300">{lead.aiScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {lead.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700"><FaTags size={8} className="text-slate-500" /> {tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-300 truncate max-w-[200px]">{lead.lastActivity}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 uppercase">{lead.timestamp}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RENDER DRAWER IF A LEAD IS SELECTED */}
      {selectedLead && (
        <LeadProfile 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
        />
      )}

    </div>
  );
}

export default Leads;