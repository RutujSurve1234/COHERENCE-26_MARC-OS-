import React, { useState, useMemo, useRef, useEffect } from 'react'; // <-- Added useEffect here
import { 
  FaSearch, FaFilter, FaCloudUploadAlt, FaTrash, FaEdit,
  FaUserPlus, FaFire, FaBullseye, FaTags, FaTimes, FaFileCsv, FaSpinner, FaCheck
} from "react-icons/fa";
import StatCard from '../components/StatCard';
import LeadProfile from './LeadProfile'; 

export default function Leads() {
  // --- STATE MANAGEMENT ---
  const [selectedLead, setSelectedLead] = useState(null); 
  const [editingLead, setEditingLead] = useState(null); 
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // --- NEW: READ FROM LOCAL STORAGE ON LOAD ---
  const [leads, setLeads] = useState(() => {
    const savedLeads = localStorage.getItem('uploaded_leads');
    return savedLeads ? JSON.parse(savedLeads) : [];
  });

  // --- NEW: SAVE TO LOCAL STORAGE ON CHANGE ---
  useEffect(() => {
    localStorage.setItem('uploaded_leads', JSON.stringify(leads));
  }, [leads]);

  // --- CRUD ACTIONS ---
  const handleDelete = (id, e) => {
    e.stopPropagation();
    setLeads(leads.filter(lead => lead.id !== id));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setLeads(leads.map(l => l.id === editingLead.id ? editingLead : l));
    setEditingLead(null); 
  };

  // --- API INTEGRATION: REAL FILE UPLOAD ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleActualImport = async () => {
    if (!selectedFile) return;
    
    setIsImporting(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/leads/upload-leads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload file");
      }

      const data = await response.json();
      
      const newLeads = data.leads.map((lead, index) => {
        const colors = ["from-emerald-400 to-teal-500", "from-indigo-400 to-blue-500", "from-purple-400 to-pink-500", "from-amber-400 to-orange-500"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        return {
          id: Date.now() + index, 
          name: lead.Name || lead.name || lead.Full_Name || "Unknown Lead", 
          company: lead.Company || lead.company || lead.Organization || "Unknown Company",
          email: lead.Email || lead.email || "no-email@example.com",
          status: "New",
          aiScore: Math.floor(Math.random() * (99 - 70 + 1) + 70),
          tags: ["Imported"],
          lastActivity: "Added via File Import",
          timestamp: "Just now",
          avatarColor: randomColor
        };
      });

      // Overwrite the table with the new CSV leads
      setLeads(newLeads);
      
      // Reset Modal
      setShowImportModal(false);
      setSelectedFile(null);

    } catch (error) {
      console.error("Error uploading file:", error);
      alert(error.message || "Error uploading file.");
    } finally {
      setIsImporting(false);
    }
  };

  // --- SEARCH & FILTER LOGIC ---
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            lead.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  // --- RENDER HELPERS ---
  const renderStatus = (status) => {
    const styles = {
      'Qualified': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'Contacted': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'New': 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    };
    return (
      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in pb-12 relative">
      
      {/* 1. OVERVIEW DASHBOARD */}
      <div>
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Lead Management</h1>
            <p className="text-slate-400 text-sm mt-1">Overview, segmentation, and pipeline health.</p>
          </div>
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            <FaCloudUploadAlt size={18} />
            Import / Sync Leads
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Active Leads" value={leads.length.toLocaleString()} icon={<FaBullseye />} className="h-28" />
          <StatCard title="New This Week" value={leads.filter(l => l.status === 'New').length} icon={<FaUserPlus />} className="h-28" />
          <StatCard title="High Intent" value={leads.filter(l => l.aiScore > 90).length} icon={<FaFire className="text-orange-400"/>} className="h-28" />
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-center">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pipeline Health</p>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-purple-500 w-1/4" title="New"></div>
              <div className="bg-blue-500 w-2/4" title="Contacted"></div>
              <div className="bg-emerald-500 w-1/4" title="Qualified"></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-medium">
              <span>New</span>
              <span>Contacted</span>
              <span>Qualified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-900/50">
           <div className="flex gap-4 flex-1">
             <div className="relative flex-1 max-w-sm group">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search leads by name or company..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                />
              </div>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950/50 border border-slate-700/50 text-slate-300 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
              </select>
           </div>
        </div>

        {/* 3. WORKING LEAD TABLE */}
        <div className="w-full overflow-x-auto min-h-[300px]">
          {filteredLeads.length === 0 ? (
            <div className="p-16 text-center text-slate-500 flex flex-col items-center">
              {leads.length === 0 ? (
                <>
                  <FaCloudUploadAlt className="text-5xl mb-4 text-slate-700" />
                  <p className="text-lg font-bold text-slate-300 mb-1">No Leads Found</p>
                  <p className="text-sm">Click "Import / Sync Leads" above to upload your CSV file.</p>
                </>
              ) : (
                <>
                  <FaSearch className="text-4xl mb-3 text-slate-700" />
                  <p>No leads found matching your search criteria.</p>
                </>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">AI Score</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-slate-800/60 transition-colors group cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
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
                      <p className="text-xs text-slate-300 truncate max-w-[200px]">{lead.email}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* WORKING ACTIONS */}
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingLead(lead); }}
                          className="p-2 text-slate-500 hover:text-indigo-400 rounded-lg transition-all hover:bg-slate-800"
                          title="Edit Lead"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(lead.id, e)}
                          className="p-2 text-slate-500 hover:text-rose-400 rounded-lg transition-all hover:bg-rose-500/10"
                          title="Delete Lead"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ==========================================
          MODALS & DRAWERS
      ========================================== */}

      {selectedLead && (
        <LeadProfile 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
          onUpdate={(updatedLead) => {
            setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
            setSelectedLead(updatedLead);
          }}
        />
      )}

      {editingLead && (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h2 className="text-lg font-bold text-white">Edit Lead</h2>
              <button onClick={() => setEditingLead(null)} className="text-slate-400 hover:text-white"><FaTimes /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
                <input required type="text" value={editingLead.name} onChange={e => setEditingLead({...editingLead, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                <input required type="email" value={editingLead.email} onChange={e => setEditingLead({...editingLead, email: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Company</label>
                <input required type="text" value={editingLead.company} onChange={e => setEditingLead({...editingLead, company: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
                  <select value={editingLead.status} onChange={e => setEditingLead({...editingLead, status: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none">
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">AI Score</label>
                  <input type="number" value={editingLead.aiScore} onChange={e => setEditingLead({...editingLead, aiScore: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setEditingLead(null)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ACTUAL CSV IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaCloudUploadAlt className="text-indigo-400"/> Import Leads</h2>
              <button onClick={() => { setShowImportModal(false); setSelectedFile(null); }} className="text-slate-400 hover:text-white transition-colors p-1"><FaTimes /></button>
            </div>
            
            <div className="p-8 text-center">
              
              <input 
                type="file" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              
              <div 
                onClick={() => fileInputRef.current.click()}
                className={`w-full py-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${selectedFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-600 bg-slate-800/50 hover:bg-slate-800 hover:border-indigo-500'}`}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <FaCheck className="text-4xl text-emerald-400 mb-3" />
                    <p className="text-sm font-bold text-slate-200">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FaFileCsv className="text-4xl text-slate-400 mb-4" />
                    <p className="text-sm font-bold text-slate-200 mb-1">Click to browse or drag file here</p>
                    <p className="text-xs text-slate-500">Supports .xlsx and .csv files</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleActualImport}
                disabled={isImporting || !selectedFile}
                className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg transition-all"
              >
                {isImporting ? <><FaSpinner className="animate-spin"/> Uploading & Parsing...</> : "Upload Data"}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}