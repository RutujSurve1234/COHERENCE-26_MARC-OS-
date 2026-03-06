import React, { useState } from 'react';
import { 
  FaEnvelope, FaPhoneAlt, FaLinkedin, FaBrain, 
  FaBolt, FaCheckCircle, FaRegClock, FaEdit, 
  FaPaperPlane, FaBuilding, FaTags, FaCalendarAlt, FaTimes
} from "react-icons/fa";

function LeadProfile({ lead, onClose }) {
  const [activeTab, setActiveTab] = useState('timeline');

  if (!lead) return null;

  return (
    <>
      {/* Darkened, Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md z-40 animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Centered Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        
        {/* The Modal Card */}
        <div className="bg-[#020617] border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl w-full max-w-[1200px] max-h-[90vh] flex flex-col pointer-events-auto animate-fade-in relative overflow-hidden">
          
          {/* 1. Fixed Modal Header */}
          <div className="flex items-center justify-between p-6 md:px-8 border-b border-slate-800/80 bg-slate-900/50 shrink-0">
            
            {/* Left: Lead Info */}
            <div className="flex items-center gap-4">
              <div className={`hidden sm:flex w-12 h-12 rounded-full bg-gradient-to-br ${lead.avatarColor} p-0.5 shadow-lg`}>
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg tracking-wider">
                  {lead.name.charAt(0)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">{lead.name}</h1>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
                    {lead.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5">{lead.company}</p>
              </div>
            </div>
            
            {/* Right: Actions & Close Button */}
            <div className="flex items-center gap-3">
              <button className="hidden sm:flex px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition-colors items-center gap-2">
                <FaEdit /> Edit
              </button>
              <button className="hidden md:flex px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] items-center gap-2">
                <FaPaperPlane /> Message
              </button>
              
              <div className="w-px h-8 bg-slate-700 mx-2 hidden sm:block"></div>
              
              {/* The Cross (Close) Icon */}
              <button 
                onClick={onClose}
                className="p-2.5 bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-xl transition-all group"
                title="Close Profile"
              >
                <FaTimes size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* 2. Scrollable Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              
              {/* ==========================================
                  LEFT COLUMN: Identity & AI Intel 
              ========================================== */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Contact Card */}
                <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                  
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-slate-400 border border-slate-800"><FaEnvelope /></div>
                      <span className="text-slate-300 truncate hover:text-indigo-400 cursor-pointer">{lead.name.split(' ')[0].toLowerCase()}@company.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-blue-500 border border-slate-800"><FaLinkedin /></div>
                      <span className="text-slate-300 hover:text-indigo-400 cursor-pointer">linkedin.com/in/{lead.name.replace(' ', '').toLowerCase()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-slate-400 border border-slate-800"><FaBuilding /></div>
                      <span className="text-slate-300">{lead.company}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-800/60 relative z-10">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><FaTags /> Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {lead.tags.map(tag => (
                        <span key={tag} className="bg-slate-950/80 border border-slate-700 text-slate-300 text-[11px] px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Score & Action Card */}
                <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <FaBrain size={18} />
                      <h3 className="text-sm font-bold tracking-wide uppercase">AI Intel</h3>
                    </div>
                    <div className="text-3xl font-black text-white">{lead.aiScore}<span className="text-sm text-slate-500 font-medium">/100</span></div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/60">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Key Insights</p>
                    <div className="flex items-start gap-2">
                      <FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={12} />
                      <p className="text-[11px] text-slate-300">High intent based on recent interaction logic.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={12} />
                      <p className="text-[11px] text-slate-300">Matches ideal buyer persona profile (ICP).</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-slate-800/60">
                    <div className="flex items-center gap-2 text-indigo-300 mb-2">
                      <FaBolt size={12} />
                      <h3 className="text-[11px] font-bold tracking-wide uppercase">Suggested Action</h3>
                    </div>
                    <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2">
                      <FaCalendarAlt /> Schedule Call
                    </button>
                  </div>
                </div>

              </div>

              {/* ==========================================
                  RIGHT COLUMN: Stages & Timeline 
              ========================================== */}
              <div className="lg:col-span-8">
                <div className="bg-slate-900 border border-slate-800/60 rounded-2xl shadow-xl flex flex-col h-full min-h-[500px]">
                  
                  {/* Tabs */}
                  <div className="flex items-center px-6 border-b border-slate-800/60 shrink-0 bg-slate-950/30 rounded-t-2xl">
                    <button 
                      className={`py-4 px-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                      onClick={() => setActiveTab('timeline')}
                    >
                      Campaign Stages & Activity
                    </button>
                    <button 
                      className={`py-4 px-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'notes' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                      onClick={() => setActiveTab('notes')}
                    >
                      Internal Notes
                    </button>
                  </div>

                  {/* Timeline Content */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="relative border-l-2 border-slate-800 ml-4 space-y-8 pb-4">
                      
                        {/* Active Stage */}
                        <div className="relative pl-8">
                        <div className="absolute -left-[17px] top-0 w-8 h-8 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                          <FaCheckCircle size={14} />
                        </div>
                        <div className="bg-slate-950/80 border border-emerald-500/30 p-5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold text-emerald-400">Current Stage: {lead.status}</span>
                            <span className="text-xs text-slate-500">{lead.timestamp}</span>
                          </div>
                          <p className="text-sm text-slate-300 mb-3">{lead.lastActivity}</p>
                          <span className="inline-block px-2.5 py-1 bg-slate-900 rounded-md border border-slate-800 text-[10px] text-slate-400 font-mono">Status: Awaiting your manual action</span>
                        </div>
                      </div>

                      {/* Previous Automated Action */}
                      <div className="relative pl-8">
                        <div className="absolute -left-[17px] top-0 w-8 h-8 bg-indigo-500/20 border border-indigo-500 rounded-full flex items-center justify-center text-indigo-400">
                          <FaPaperPlane size={12} />
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-bold text-slate-200">AI Outreach Workflow: Step 2</span>
                            <span className="text-xs text-slate-500">Yesterday, 09:15 AM</span>
                          </div>
                          <p className="text-sm text-slate-400">Automated follow-up message generated and sent successfully.</p>
                        </div>
                      </div>

                      {/* System Import */}
                      <div className="relative pl-8">
                        <div className="absolute -left-[17px] top-0 w-8 h-8 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-500">
                          <FaRegClock size={12} />
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-bold text-slate-400">Imported to System</span>
                            <span className="text-xs text-slate-500">Oct 22, 11:00 AM</span>
                          </div>
                          <p className="text-xs text-slate-500">Via Excel Bulk Import</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeadProfile;