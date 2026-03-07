import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, FaPlay, FaPause, FaSave, FaEnvelope, FaLinkedin, 
  FaClock, FaCodeBranch, FaRobot, FaBolt, FaPlus, FaTrash, FaChevronDown, FaChartLine, FaSpinner
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

// --- NODE LIBRARY CONFIGURATION ---
const NODE_TYPES = {
  trigger: { id: 'trigger', name: 'Entry Trigger', icon: FaBolt, color: 'amber', category: 'Triggers', defaultData: { source: 'Dynamic Segment', rule: 'Score > 75' } },
  email: { id: 'email', name: 'Send Email', icon: FaEnvelope, color: 'blue', category: 'Actions', defaultData: { channel: 'Email', template: 'Hi {name},\n\nWe love what you are building.' } },
  linkedin: { id: 'linkedin', name: 'LinkedIn Message', icon: FaLinkedin, color: 'blue', category: 'Actions', defaultData: { channel: 'LinkedIn', template: 'Hey {name},' } },
  delay: { id: 'delay', name: 'Wait / Delay', icon: FaClock, color: 'slate', category: 'Logic', defaultData: { duration: '10', unit: 'Seconds', variance: 'Exact' } }, // Defaulted to Seconds for testing
  ai: { id: 'ai', name: 'AI Gen / Rewrite', icon: FaRobot, color: 'indigo', category: 'AI Engine', defaultData: { prompt: 'Make it professional and under 100 words.' } },
  condition: { id: 'condition', name: 'Condition Check', icon: FaCodeBranch, color: 'purple', category: 'Logic', defaultData: { rule: 'If lead replied' } },
};

export default function WorkflowBuilder() {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [flowNodes, setFlowNodes] = useState([
    { id: 'trigger-initial', type: 'trigger', data: { ...NODE_TYPES.trigger.defaultData } }
  ]);
  const [activeNodeId, setActiveNodeId] = useState('trigger-initial');
  const [isDraggingOver, setIsDraggingOver] = useState(null);
  const [panelTab, setPanelTab] = useState('config');

  // --- HEADER ACTIONS STATE ---
  const [workflowStatus, setWorkflowStatus] = useState('Draft'); 
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('2 minutes ago');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved('Just now');
    }, 800);
  };

  // --- AUTOMATION INTEGRATION (UPDATED FOR CONDITION BRANCHES & LEAD STATUS) ---
  const handleToggleStatus = async () => {
    if (workflowStatus === 'Active') {
      setWorkflowStatus('Paused');
      setLastSaved('Just now');
      return;
    }

    const savedLeads = localStorage.getItem('uploaded_leads');
    const parsedLeads = savedLeads ? JSON.parse(savedLeads) : [];

    if (parsedLeads.length === 0) {
      alert("⚠️ No leads found! Please go to the Leads page and upload a CSV first.");
      return;
    }

    const targetLeads = parsedLeads.map(lead => ({
      name: lead.name || "Unknown",
      company: lead.company || "Unknown Company",
      role: "Executive",
      email: lead.email || ""
    }));

    setWorkflowStatus('Active');
    setLastSaved('Just now');

    // --- RECURSIVELY EXTRACT THE FULL TREE ---
    const extractTree = (nodes) => {
      return nodes.map(node => ({
        type: node.type,
        config: node.data,
        trueNodes: node.trueNodes ? extractTree(node.trueNodes) : [],
        falseNodes: node.falseNodes ? extractTree(node.falseNodes) : []
      }));
    };
    
    const workflowSteps = extractTree(flowNodes);

    try {
      const response = await fetch("http://localhost:8000/automation/start-automated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_name: "Visual Canvas Outreach",
          leads: targetLeads, 
          workflow: { steps: workflowSteps }
        })
      });

      if (!response.ok) throw new Error("Failed to start workflow");
      
      const data = await response.json();

      // === NEW: UPDATE ALL LEADS IN LOCAL STORAGE ===
      // This makes the Leads page instantly show them as "Contacted"
      const updatedLeads = parsedLeads.map(lead => ({
        ...lead,
        status: "Contacted", // Move them out of "New"
        lastActivity: "Enrolled in AI Workflow",
        timestamp: "Just now",
        aiScore: lead.aiScore > 90 ? lead.aiScore : lead.aiScore + 5 // Slight bump for engagement
      }));
      localStorage.setItem('uploaded_leads', JSON.stringify(updatedLeads));
      // ===============================================

      alert(`🚀 Engine Started: ${data.message}\n${targetLeads.length} Leads have been marked as 'Contacted' in your dashboard.`);

    } catch (error) {
      console.error(error);
      alert("Failed to start automation. Is your FastAPI backend running?");
      setWorkflowStatus('Draft'); 
    }
  };

  // --- RECURSIVE TREE HELPERS ---
  const findNode = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.type === 'condition') {
        const found = findNode(node.trueNodes || [], id) || findNode(node.falseNodes || [], id);
        if (found) return found;
      }
    }
    return null;
  };

  const deleteFromTree = (nodes, idToDelete) => {
    return nodes.filter(n => n.id !== idToDelete).map(n => {
      if (n.type === 'condition') {
        return {
          ...n,
          trueNodes: deleteFromTree(n.trueNodes || [], idToDelete),
          falseNodes: deleteFromTree(n.falseNodes || [], idToDelete)
        };
      }
      return n;
    });
  };

  const insertIntoTree = (nodes, parentPath, index, newNode) => {
    if (parentPath === 'root') {
      const newNodes = [...nodes];
      newNodes.splice(index, 0, newNode);
      return newNodes;
    }
    const isTrueBranch = parentPath.endsWith('-true');
    const targetParentId = parentPath.replace('-true', '').replace('-false', '');

    return nodes.map(n => {
      if (n.id === targetParentId) {
        const branchKey = isTrueBranch ? 'trueNodes' : 'falseNodes';
        const currentBranch = n[branchKey] || [];
        const newBranch = [...currentBranch];
        newBranch.splice(index, 0, newNode);
        return { ...n, [branchKey]: newBranch };
      }
      if (n.type === 'condition') {
        return {
          ...n,
          trueNodes: insertIntoTree(n.trueNodes || [], parentPath, index, newNode),
          falseNodes: insertIntoTree(n.falseNodes || [], parentPath, index, newNode)
        };
      }
      return n;
    });
  };

  const updateNodeInTree = (nodes, idToUpdate, key, value) => {
    return nodes.map(n => {
      if (n.id === idToUpdate) return { ...n, data: { ...n.data, [key]: value } };
      if (n.type === 'condition') {
        return {
          ...n,
          trueNodes: updateNodeInTree(n.trueNodes || [], idToUpdate, key, value),
          falseNodes: updateNodeInTree(n.falseNodes || [], idToUpdate, key, value)
        };
      }
      return n;
    });
  };

  // --- DRAG & DROP HANDLERS ---
  const handleDragStart = (e, nodeType) => e.dataTransfer.setData('nodeType', nodeType);
  const handleDragOver = (e, dropZoneId) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(dropZoneId); };
  const handleDragLeave = () => setIsDraggingOver(null);
  const handleDrop = (e, parentPath, index) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(null);
    const nodeType = e.dataTransfer.getData('nodeType');
    if (!nodeType) return;

    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      data: { ...NODE_TYPES[nodeType].defaultData },
      ...(nodeType === 'condition' ? { trueNodes: [], falseNodes: [] } : {})
    };
    setFlowNodes(prev => insertIntoTree(prev, parentPath, index, newNode));
    setActiveNodeId(newNode.id);
  };
  const deleteNode = () => { setFlowNodes(prev => deleteFromTree(prev, activeNodeId)); setActiveNodeId(null); };
  const updateActiveNode = (key, value) => { setFlowNodes(prev => updateNodeInTree(prev, activeNodeId, key, value)); };

  // --- RENDER HELPERS ---
  const colorMap = {
    amber: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    indigo: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    blue: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    purple: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    slate: "text-slate-400 border-slate-700 bg-slate-800/50",
  };

  const renderFlow = (nodes, parentPath) => {
    return nodes.map((node, index) => {
      const def = NODE_TYPES[node.type];
      const isActive = activeNodeId === node.id;
      const Icon = def.icon;
      const dropZoneId = `${parentPath}-${index + 1}`;

      return (
        <div key={node.id} className="flex flex-col items-center">
          
          <div 
            onClick={(e) => { e.stopPropagation(); setActiveNodeId(node.id); }}
            className={`relative w-64 rounded-2xl border-2 cursor-pointer transition-all duration-300 shadow-lg ${
              isActive 
                ? "border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.15)] scale-105 bg-slate-900 z-10" 
                : "border-slate-800 bg-slate-900/80 hover:border-slate-600 hover:shadow-xl"
            }`}
          >
            <div className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border shrink-0 ${colorMap[def.color]}`}>
                <Icon />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-[13px] font-bold text-slate-100 tracking-tight leading-tight mb-0.5">{def.name}</h3>
                <p className="text-[11px] text-slate-400 truncate">
                  {node.type === 'trigger' && `${node.data.source} (${node.data.rule})`}
                  {node.type === 'delay' && `Wait ${node.data.duration} ${node.data.unit}`}
                  {node.type === 'email' && node.data.template}
                  {node.type === 'linkedin' && node.data.template}
                  {node.type === 'ai' && node.data.prompt}
                  {node.type === 'condition' && node.data.rule}
                </p>
              </div>
            </div>
          </div>

          {node.type === 'condition' ? (
            <div className="flex flex-col items-center w-full">
               {/* Shorter top connection line */}
               <div className="w-0.5 h-4 bg-slate-700"></div>
               <div className="w-[320px] h-0.5 bg-slate-700 relative">
                  {/* Left branch line */}
                  <div className="absolute -left-[1px] top-0 w-0.5 h-5 bg-slate-700"></div>
                  <FaChevronDown className="absolute -left-[6px] top-3 text-slate-600 text-[10px]" />
                  <div className="absolute -left-[24px] -top-1 bg-slate-950 border border-emerald-500/30 text-emerald-400 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-lg z-10">
                    Yes
                  </div>
                  
                  {/* Right branch line */}
                  <div className="absolute -right-[1px] top-0 w-0.5 h-5 bg-slate-700"></div>
                  <FaChevronDown className="absolute -right-[6px] top-3 text-slate-600 text-[10px]" />
                  <div className="absolute -right-[20px] -top-1 bg-slate-950 border border-rose-500/30 text-rose-400 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-lg z-10">
                    No
                  </div>
               </div>
               
               {/* Reduced top margin for branches */}
               <div className="flex gap-16 mt-5">
                 <div className="flex flex-col items-center w-64">
                    <div 
                      onDragOver={(e) => handleDragOver(e, `${node.id}-true-0`)} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, `${node.id}-true`, 0)}
                      className={`w-full h-6 mb-1 rounded-full transition-all ${isDraggingOver === `${node.id}-true-0` ? 'bg-indigo-500/20 border-2 border-dashed border-indigo-500 h-10' : 'bg-transparent border-2 border-transparent'}`}
                    ></div>
                    {renderFlow(node.trueNodes || [], `${node.id}-true`)}
                 </div>

                 <div className="flex flex-col items-center w-64">
                     <div 
                      onDragOver={(e) => handleDragOver(e, `${node.id}-false-0`)} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, `${node.id}-false`, 0)}
                      className={`w-full h-6 mb-1 rounded-full transition-all ${isDraggingOver === `${node.id}-false-0` ? 'bg-indigo-500/20 border-2 border-dashed border-indigo-500 h-10' : 'bg-transparent border-2 border-transparent'}`}
                    ></div>
                    {renderFlow(node.falseNodes || [], `${node.id}-false`)}
                 </div>
               </div>
            </div>
          ) : (
            // Shorter linear connector
            <div className="flex flex-col items-center mt-0.5">
              <div className="w-0.5 h-4 bg-slate-700"></div>
              <FaChevronDown className="text-slate-600 -mt-2 text-[10px]" />
            </div>
          )}

          {/* Shorter drop zone area to reduce gaps */}
          <div 
            onDragOver={(e) => handleDragOver(e, dropZoneId)} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, parentPath, index + 1)}
            className={`w-64 h-6 my-0.5 rounded-full flex items-center justify-center transition-all duration-200 ${
              isDraggingOver === dropZoneId 
                ? 'bg-indigo-500/10 border-2 border-dashed border-indigo-500 scale-105 shadow-[0_0_20px_rgba(79,70,229,0.2)] h-12' 
                : 'bg-transparent border-2 border-transparent'
            }`}
          >
            {isDraggingOver === dropZoneId && <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><FaPlus /> Drop Next Step</span>}
          </div>

        </div>
      );
    });
  };

  const activeNode = findNode(flowNodes, activeNodeId);
  const activeNodeTypeDef = activeNode ? NODE_TYPES[activeNode.type] : null;

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col bg-[#020617] -m-6 lg:-m-8 animate-fade-in overflow-hidden font-sans">
      
      <header className="h-[72px] shrink-0 bg-[#090f1e] border-b border-slate-800 px-6 flex items-center justify-between z-30 shadow-md">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate('/workflows')} className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700">
            <FaArrowLeft />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-white tracking-tight">Enterprise Outreach Workflow</h1>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider transition-colors ${
                workflowStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                workflowStatus === 'Paused' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {workflowStatus}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Last saved: {lastSaved}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-colors border border-slate-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />} 
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          
          <button 
            onClick={handleToggleStatus}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              workflowStatus === 'Active' 
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            }`}
          >
            {workflowStatus === 'Active' ? <FaPause size={12} /> : <FaPlay size={12} />} 
            {workflowStatus === 'Active' ? 'Pause Workflow' : 'Activate Workflow'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        
        <div className="w-[280px] shrink-0 bg-[#090f1e]/90 border-r border-slate-800 flex flex-col z-10 backdrop-blur-md">
          <div className="p-5 border-b border-slate-800 bg-slate-900/50">
            <p className="text-sm font-bold text-white mb-1">Toolbox</p>
            <p className="text-[11px] text-slate-500">Drag nodes into the canvas to build</p>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
            {['Triggers', 'Logic', 'Actions', 'AI Engine'].map(category => (
              <div key={category}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  {category} <span className="flex-1 h-px bg-slate-800"></span>
                </p>
                <div className="space-y-3">
                  {Object.values(NODE_TYPES).filter(n => n.category === category).map(node => (
                    <div 
                      key={node.id} draggable onDragStart={(e) => handleDragStart(e, node.id)}
                      className="flex items-center gap-4 p-3 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(79,70,229,0.1)] group"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shadow-inner ${colorMap[node.color]} group-hover:scale-110 transition-transform`}>
                        <node.icon />
                      </div>
                      <span className="text-sm font-semibold text-slate-200">{node.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div 
          className="flex-1 bg-[#020617] overflow-auto custom-scrollbar" 
          onClick={() => setActiveNodeId(null)}
        >
          <div 
            className="min-w-max min-h-full flex flex-col items-center py-10 px-32" 
            style={{ backgroundImage: 'radial-gradient(#1e293b 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
          >
            {flowNodes.length === 0 && (
              <div 
                onDragOver={(e) => handleDragOver(e, 'root-0')} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, 'root', 0)}
                className={`w-64 h-24 rounded-3xl flex items-center justify-center transition-all ${isDraggingOver === 'root-0' ? 'bg-indigo-500/10 border-2 border-dashed border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.15)]' : 'bg-slate-900/50 border-2 border-dashed border-slate-700'}`}
              >
                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-3"><FaPlus /> Drop Trigger</span>
              </div>
            )}

            {renderFlow(flowNodes, 'root')}
            <div className="h-40"></div>
          </div>
        </div>

        <div className="w-[400px] shrink-0 bg-[#090f1e] border-l border-slate-800 z-20 flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.4)]">
          <div className="flex border-b border-slate-800 shrink-0 bg-slate-950/50">
            <button 
              onClick={() => setPanelTab('config')} 
              className={`flex-1 py-4 text-[11px] font-bold uppercase tracking-widest transition-colors border-b-2 ${panelTab === 'config' ? 'border-indigo-500 text-white bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Configuration
            </button>
            <button 
              onClick={() => setPanelTab('analytics')} 
              className={`flex-1 py-4 text-[11px] font-bold uppercase tracking-widest transition-colors border-b-2 flex items-center justify-center gap-2 ${panelTab === 'analytics' ? 'border-indigo-500 text-white bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              <FaChartLine /> Analytics
            </button>
          </div>

          <div className="p-6 border-b border-slate-800">
            {activeNode ? (
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-3 mb-1">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg border ${colorMap[activeNodeTypeDef.color]}`}>
                      <activeNodeTypeDef.icon className="text-sm" />
                    </div>
                    {activeNodeTypeDef.name}
                  </h2>
                </div>
                {activeNode.type !== 'trigger' && (
                  <button onClick={deleteNode} title="Delete Node" className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20">
                    <FaTrash />
                  </button>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">Select a node to edit</div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#020617]/30">
            {panelTab === 'config' && activeNode ? (
              <>
                {activeNode.type === 'trigger' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Lead Source</label>
                      <select value={activeNode.data.source} onChange={(e) => updateActiveNode('source', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 transition-colors">
                        <option value="Dynamic Segment">Dynamic Segment</option>
                        <option value="CSV Import">CSV Import</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Enrollment Rule</label>
                      <input type="text" value={activeNode.data.rule} onChange={(e) => updateActiveNode('rule', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 transition-colors" />
                    </div>
                  </>
                )}

                {(activeNode.type === 'email' || activeNode.type === 'linkedin') && (
                  <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Message Template</label>
                     <textarea rows="10" value={activeNode.data.template} onChange={(e) => updateActiveNode('template', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 transition-colors custom-scrollbar font-mono resize-none"></textarea>
                  </div>
                )}
                
                {activeNode.type === 'delay' && (
                  <>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Wait Duration</label>
                    <div className="flex gap-3 mb-4">
                      <input type="number" value={activeNode.data.duration} onChange={(e) => updateActiveNode('duration', e.target.value)} className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 text-center" />
                      <select value={activeNode.data.unit} onChange={(e) => updateActiveNode('unit', e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200">
                        <option value="Days">Days</option>
                        <option value="Hours">Hours</option>
                        <option value="Minutes">Minutes</option>
                        <option value="Seconds">Seconds</option>
                      </select>
                    </div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Variance</label>
                    <select value={activeNode.data.variance} onChange={(e) => updateActiveNode('variance', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200">
                      <option value="Exact">Exact Timing (For testing)</option>
                      <option value="± 1 to 3 hours">± 1 to 3 hours</option>
                      <option value="± 15 to 45 mins">± 15 to 45 mins</option>
                    </select>
                  </>
                )}

                {activeNode.type === 'condition' && (
                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Evaluation Rule</label>
                     <select value={activeNode.data.rule} onChange={(e) => updateActiveNode('rule', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200">
                       <option value="If lead replied">If lead replied</option>
                       <option value="If email opened > 2 times">If email opened &gt; 2 times</option>
                       <option value="If AI Score > 90">If AI Score &gt; 90</option>
                     </select>
                   </div>
                )}
              </>
            ) : panelTab === 'analytics' && activeNode ? (
               <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Leads Processed (All Time)</h3>
                  <p className="text-3xl font-black text-white">4,208</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}