import React, { useState } from 'react';
import { 
  FaPlus, FaPlay, FaPause, FaCopy, FaTrash, 
  FaProjectDiagram, FaUsers, FaCheckCircle, FaShieldAlt
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Workflows() {
  const navigate = useNavigate();
  
  // Changed to include setWorkflows so we can update the state
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: "Enterprise Tech - C-Level Outreach",
      status: "Active",
      enrolled: 1240,
      actionsExecuted: 5420,
      conversion: "8.4%",
      safety: "Strict",
      lastEdited: "2 hours ago"
    },
    {
      id: 2,
      name: "SaaS Founders Follow-up Sequence",
      status: "Paused",
      enrolled: 450,
      actionsExecuted: 1200,
      conversion: "4.1%",
      safety: "Moderate",
      lastEdited: "1 day ago"
    },
    {
      id: 3,
      name: "Inbound Lead Qualification (AI Scoring)",
      status: "Draft",
      enrolled: 0,
      actionsExecuted: 0,
      conversion: "0.0%",
      safety: "Strict",
      lastEdited: "Just now"
    }
  ]);

  // --- INTERACTIVE FUNCTIONS ---

  // 1. Toggle Workflow Status (Active <-> Paused)
  const handleToggleStatus = (id) => {
    setWorkflows(workflows.map(wf => {
      if (wf.id === id) {
        // Prevent starting a Draft that has no leads (simulated logic)
        if (wf.status === 'Draft') return { ...wf, status: 'Active', lastEdited: 'Just now' };
        return { 
          ...wf, 
          status: wf.status === 'Active' ? 'Paused' : 'Active',
          lastEdited: 'Just now'
        };
      }
      return wf;
    }));
  };

  // 2. Duplicate a Workflow
  const handleDuplicate = (id) => {
    const wfToCopy = workflows.find(wf => wf.id === id);
    if (wfToCopy) {
      const duplicatedWf = {
        ...wfToCopy,
        id: Date.now(), // Generate unique ID
        name: `${wfToCopy.name} (Copy)`,
        status: 'Draft', // Copies always start as Draft
        enrolled: 0,
        actionsExecuted: 0,
        conversion: "0.0%",
        lastEdited: "Just now"
      };
      // Add the new workflow to the beginning of the list
      setWorkflows([duplicatedWf, ...workflows]);
    }
  };

  // 3. Delete a Workflow
  const handleDelete = (id) => {
    setWorkflows(workflows.filter(wf => wf.id !== id));
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FaProjectDiagram className="text-indigo-500" /> Workflow Engine
          </h1>
          <p className="text-slate-400 text-sm mt-2">Manage, simulate, and track your AI-driven outreach automation.</p>
        </div>
        <button 
          onClick={() => navigate('/workflows/builder')}
          className="z-10 flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
        >
          <FaPlus /> Create New Workflow
        </button>
      </div>

      {/* Workflows Grid */}
      {workflows.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <FaProjectDiagram className="text-slate-600 text-5xl mb-4" />
          <h3 className="text-xl font-bold text-slate-200 mb-2">No Active Workflows</h3>
          <p className="text-slate-500 text-sm max-w-md">You haven't created any outreach sequences yet. Click the button above to start building your first AI-driven workflow.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map(wf => (
            <div key={wf.id} className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all group relative overflow-hidden flex flex-col h-full">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                  wf.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  wf.status === 'Paused' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {wf.status}
                </div>
                
                {/* Delete Button replaced the Ellipsis */}
                <button 
                  onClick={() => handleDelete(wf.id)}
                  title="Delete Workflow"
                  className="text-slate-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-indigo-400 transition-colors line-clamp-1">{wf.name}</h3>
              <p className="text-xs text-slate-500 mb-6 flex items-center gap-1.5"><FaShieldAlt /> Safety Throttling: {wf.safety}</p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1.5"><FaUsers /> Enrolled</p>
                  <p className="text-xl font-black text-slate-200">{wf.enrolled.toLocaleString()}</p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1.5"><FaCheckCircle /> Converted</p>
                  <p className="text-xl font-black text-emerald-400">{wf.conversion}</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                <span className="text-xs text-slate-500">Edited {wf.lastEdited}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDuplicate(wf.id)}
                    title="Duplicate" 
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                  >
                    <FaCopy />
                  </button>
                  
                  <button 
                    onClick={() => handleToggleStatus(wf.id)}
                    title={wf.status === 'Active' ? "Pause" : "Start"} 
                    className={`p-2 rounded-lg transition-all ${
                      wf.status === 'Active' 
                        ? 'text-amber-500 hover:bg-amber-500/10' 
                        : 'text-emerald-500 hover:bg-emerald-500/10'
                    }`}
                  >
                    {wf.status === 'Active' ? <FaPause /> : <FaPlay />}
                  </button>

                  <div className="w-px h-6 bg-slate-800 my-auto mx-1"></div>

                  <button 
                    onClick={() => navigate('/workflows/builder')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
                  >
                    Edit Flow
                  </button>   
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workflows;