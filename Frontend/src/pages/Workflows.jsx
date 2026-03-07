import React, { useState, useEffect } from 'react';
import { 
  FaPlus, FaPlay, FaPause, FaCopy, FaTrash, FaEdit, FaTimes,
  FaProjectDiagram, FaUsers, FaCheckCircle, FaShieldAlt
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Workflows() {
  const navigate = useNavigate();
  
  // --- STATE (READ FROM LOCAL STORAGE) ---
  const [workflows, setWorkflows] = useState(() => {
    const savedWorkflows = localStorage.getItem('saved_workflows');
    return savedWorkflows ? JSON.parse(savedWorkflows) : [];
  });

  const [editingWf, setEditingWf] = useState(null); 

  // --- PERSIST CHANGES ---
  useEffect(() => {
    localStorage.setItem('saved_workflows', JSON.stringify(workflows));
  }, [workflows]);

  // --- SMART SIMULATOR (Capped at realistic limits) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkflows(prevWorkflows => prevWorkflows.map(wf => {
        // Only run metrics if the workflow is Active AND has enrolled leads
        if (wf.status === 'Active' && wf.enrolled > 0) {
          
          // Calculate a realistic cap (e.g., ~4 actions per enrolled lead)
          const maxActions = wf.enrolled * 4; 
          const currentActions = wf.actionsExecuted || 0;
          
          if (currentActions < maxActions) {
            // Add 1 to 3 actions randomly every tick to simulate real processing
            const newActions = currentActions + Math.floor(Math.random() * 3) + 1;
            
            // Slowly increase conversion, capping around 12-15%
            const currentConversion = parseFloat(wf.conversion || "0.0") || 0;
            const newConversion = currentConversion < 14.5 ? (currentConversion + 0.05).toFixed(2) : currentConversion.toFixed(2);
            
            return { 
              ...wf, 
              actionsExecuted: Math.min(newActions, maxActions), // Ensure it doesn't exceed the cap
              conversion: `${newConversion}%` 
            };
          }
        }
        return wf;
      }));
    }, 3500); // Ticks every 3.5 seconds
    
    return () => clearInterval(interval);
  }, []);


  // --- INTERACTIVE FUNCTIONS ---

  const handleToggleStatus = (id) => {
    // Pull the real leads from localStorage to determine enrollment
    const savedLeads = JSON.parse(localStorage.getItem('uploaded_leads') || '[]');
    const totalLeadsCount = savedLeads.length;

    setWorkflows(workflows.map(wf => {
      if (wf.id === id) {
        if (wf.status === 'Draft' || wf.status === 'Paused') {
          // Update the enrolled number instantly based on the Leads page CSV
          return { ...wf, status: 'Active', enrolled: totalLeadsCount, lastEdited: 'Just now' };
        } else {
          return { ...wf, status: 'Paused', lastEdited: 'Just now' };
        }
      }
      return wf;
    }));
  };

  const handleDuplicate = (id) => {
    const wfToCopy = workflows.find(wf => wf.id === id);
    if (wfToCopy) {
      const duplicatedWf = {
        ...wfToCopy,
        id: Date.now(),
        name: `${wfToCopy.name} (Copy)`,
        status: 'Draft',
        enrolled: 0,
        actionsExecuted: 0,
        conversion: "0.0%",
        lastEdited: "Just now"
      };
      setWorkflows([duplicatedWf, ...workflows]);
    }
  };

  const handleDelete = (id) => {
    setWorkflows(workflows.filter(wf => wf.id !== id));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setWorkflows(workflows.map(wf => wf.id === editingWf.id ? { ...editingWf, lastEdited: 'Just now' } : wf));
    setEditingWf(null);
  };

  // --- CREATION FUNCTION ---
  const handleCreateNew = () => {
    const newWorkflow = {
      id: Date.now(),
      name: "New Automated Sequence",
      status: "Draft",
      enrolled: 0,
      actionsExecuted: 0,
      conversion: "0.0%",
      safety: "Strict",
      lastEdited: "Just now"
    };
    
    const updatedWorkflows = [newWorkflow, ...workflows];
    setWorkflows(updatedWorkflows);
    
    // Save to memory instantly so the draft is present when returning from builder
    localStorage.setItem('saved_workflows', JSON.stringify(updatedWorkflows));
    
    // Jump straight to the canvas
    navigate('/workflows/builder'); 
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in pb-12 relative">
      
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
          onClick={handleCreateNew}
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
            <div key={wf.id} className={`bg-slate-900 border rounded-2xl p-6 shadow-xl transition-all flex flex-col h-full ${wf.status === 'Active' ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-slate-800/80 hover:border-slate-700'}`}>
              
              {/* Header with Edit & Delete */}
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                  wf.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  wf.status === 'Paused' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {wf.status}
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setEditingWf(wf)}
                    title="Edit Settings"
                    className="text-slate-500 hover:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(wf.id)}
                    title="Delete Workflow"
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-indigo-400 transition-colors line-clamp-1">{wf.name}</h3>
              <p className="text-xs text-slate-500 mb-6 flex items-center gap-1.5"><FaShieldAlt /> Safety Throttling: {wf.safety}</p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-6 mt-4">
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[9px] text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1.5">Enrolled</p>
                  <p className="text-lg font-black text-slate-200">{wf.enrolled || 0}</p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[9px] text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1.5">Actions</p>
                  <p className="text-lg font-black text-indigo-400">{wf.actionsExecuted || 0}</p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <p className="text-[9px] text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1.5">Converted</p>
                  <p className="text-lg font-black text-emerald-400">{wf.conversion || '0.0%'}</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 mt-auto">
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

      {/* ==========================================
          EDIT MODAL
      ========================================== */}
      {editingWf && (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaProjectDiagram className="text-indigo-400"/> Edit Workflow Settings</h2>
              <button onClick={() => setEditingWf(null)} className="text-slate-400 hover:text-white transition-colors p-1"><FaTimes /></button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Workflow Name</label>
                <input 
                  required 
                  type="text" 
                  value={editingWf.name} 
                  onChange={e => setEditingWf({...editingWf, name: e.target.value})} 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FaShieldAlt /> Safety Throttling Level
                </label>
                <select 
                  value={editingWf.safety} 
                  onChange={e => setEditingWf({...editingWf, safety: e.target.value})} 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Strict">Strict (Max 100 emails/day, high variance)</option>
                  <option value="Moderate">Moderate (Max 300 emails/day, standard variance)</option>
                  <option value="Relaxed">Relaxed (Max 1000 emails/day, low variance)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-2">Adjusts the automated delays between node executions to protect sender reputation.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800/60 mt-6">
                <button 
                  type="button" 
                  onClick={() => setEditingWf(null)} 
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Workflows;