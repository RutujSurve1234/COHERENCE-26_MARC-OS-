import React, { useState } from 'react';
import { 
  FaEnvelope, FaPhoneAlt, FaLinkedin, FaBrain, 
  FaBolt, FaCheckCircle, FaRegClock, FaEdit, 
  FaPaperPlane, FaBuilding, FaTags, FaCalendarAlt, FaTimes, FaSave, FaSpinner
} from "react-icons/fa";

function LeadProfile({ lead, onClose, onUpdate }) {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('timeline');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...lead });
  
  // Messaging & AI States
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageDraft, setMessageDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false); // State for Groq AI generator
  const [scheduleStatus, setScheduleStatus] = useState('Schedule Call');

  const [notes, setNotes] = useState([
    { id: 1, text: "Company secured Series B. High priority for enterprise tier.", author: "Admin", time: "Oct 24, 2:30 PM" }
  ]);
  const [newNote, setNewNote] = useState('');

  if (!lead) return null;

  // --- HANDLERS ---
  const handleSave = () => {
    if (onUpdate) onUpdate(formData); 
    setIsEditing(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const note = { id: Date.now(), text: newNote, author: "Admin Operator", time: "Just now" };
    setNotes([note, ...notes]);
    setNewNote('');
  };

  // 1. CONNECT TO GROQ AI (Generate Message)
  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch("http://localhost:8000/ai/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          role: "Executive", // Hardcoded for demo, could be dynamic
          insight: "Noticed your recent growth and scale." // Hardcoded for demo
        })
      });
      
      if (!response.ok) throw new Error("Failed to generate AI message");
      
      const data = await response.json();
      // Dump the generated text into the textarea
      setMessageDraft(data.message); 
      
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI message. Is your FastAPI server running?");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // 2. CONNECT TO EMAIL SERVICE (Send Message)
  const handleSendMessage = async () => {
    setIsSending(true);
    try {
      const response = await fetch("http://localhost:8000/ai/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to_email: formData.email,
          subject: `Partnership Inquiry from Coherence AI`,
          body: messageDraft
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to send email");
      }

      setMessageDraft('');
      setIsMessageModalOpen(false);
      setActiveTab('timeline');
      alert(`Success! Email sent to ${formData.email}`);

    } catch (error) {
      console.error(error);
      alert(error.message || "Error sending email. Check backend console.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSchedule = () => {
    setScheduleStatus('Scheduling...');
    setTimeout(() => setScheduleStatus('Invite Sent!'), 800);
    setTimeout(() => setScheduleStatus('Schedule Call'), 3000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md z-40 animate-fade-in" onClick={onClose}></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div className="bg-[#020617] border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl w-full max-w-[1200px] h-[90vh] flex flex-col pointer-events-auto animate-fade-in relative overflow-hidden">
          
          <div className="flex items-center justify-between p-6 md:px-8 border-b border-slate-800/80 bg-slate-900/50 shrink-0">
            <div className="flex items-center gap-4 flex-1">
              <div className={`hidden sm:flex w-12 h-12 rounded-full bg-gradient-to-br ${formData.avatarColor || 'from-emerald-400 to-teal-500'} p-0.5 shadow-lg`}>
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg tracking-wider">
                  {formData.name?.charAt(0) || 'L'}
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded text-white font-bold px-2 py-1 focus:border-indigo-500 outline-none" 
                      />
                      <select 
                        value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                        className="bg-slate-950 border border-slate-700 rounded text-xs text-slate-300 px-2 outline-none"
                      >
                        <option>New</option><option>Contacted</option><option>Qualified</option>
                      </select>
                    </div>
                    <input 
                      type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded text-sm text-slate-400 px-2 py-1 focus:border-indigo-500 outline-none" 
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-extrabold text-white tracking-tight">{formData.name}</h1>
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
                        {formData.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-0.5">{formData.company}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button onClick={() => { setFormData({...lead}); setIsEditing(false); }} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">Cancel</button>
                  <button onClick={handleSave} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"><FaSave /> Save</button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(true)} className="hidden sm:flex px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition-colors items-center gap-2"><FaEdit /> Edit</button>
                  <button onClick={() => setIsMessageModalOpen(true)} className="hidden md:flex px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] items-center gap-2"><FaPaperPlane /> Message</button>
                </>
              )}
              <div className="w-px h-8 bg-slate-700 mx-2 hidden sm:block"></div>
              <button onClick={onClose} className="p-2.5 bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-xl transition-all group"><FaTimes size={20} className="group-hover:rotate-90 transition-transform duration-300" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 h-full">
              
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-slate-400 border border-slate-800 shrink-0"><FaEnvelope /></div>
                      {isEditing ? (
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 outline-none focus:border-indigo-500" />
                      ) : (
                        <span className="text-slate-300 truncate hover:text-indigo-400 cursor-pointer">{formData.email}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-blue-500 border border-slate-800 shrink-0"><FaLinkedin /></div>
                      <span className="text-slate-300 truncate hover:text-indigo-400 cursor-pointer">linkedin.com/in/{formData.name?.replace(' ', '').toLowerCase()}</span>
                    </div>
                    {isEditing && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-slate-400 border border-slate-800 shrink-0"><FaBuilding /></div>
                        <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 outline-none focus:border-indigo-500" />
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-800/60 relative z-10">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><FaTags /> Tags</p>
                    {isEditing ? (
                      <input 
                        type="text" value={formData.tags?.join(', ')} onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t=>t.trim())})}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500"
                        placeholder="Comma separated tags"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags?.map((tag, idx) => (
                          <span key={idx} className="bg-slate-950/80 border border-slate-700 text-slate-300 text-[11px] px-2.5 py-1 rounded-md">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-indigo-400"><FaBrain size={18} /><h3 className="text-sm font-bold tracking-wide uppercase">AI Intel</h3></div>
                    {isEditing ? (
                      <input type="number" value={formData.aiScore} onChange={e => setFormData({...formData, aiScore: e.target.value})} className="w-16 bg-slate-950 border border-slate-700 rounded text-xl font-black text-white text-center outline-none" />
                    ) : (
                      <div className="text-3xl font-black text-white">{formData.aiScore}<span className="text-sm text-slate-500 font-medium">/100</span></div>
                    )}
                  </div>
                  <div className="space-y-3 pt-3 border-t border-slate-800/60">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Key Insights</p>
                    <div className="flex items-start gap-2"><FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={12} /><p className="text-[11px] text-slate-300">High intent based on recent interaction logic.</p></div>
                    <div className="flex items-start gap-2"><FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={12} /><p className="text-[11px] text-slate-300">Matches ideal buyer persona profile (ICP).</p></div>
                  </div>
                  <div className="mt-5 pt-5 border-t border-slate-800/60">
                    <div className="flex items-center gap-2 text-indigo-300 mb-2"><FaBolt size={12} /><h3 className="text-[11px] font-bold tracking-wide uppercase">Suggested Action</h3></div>
                    <button onClick={handleSchedule} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2"><FaCalendarAlt /> {scheduleStatus}</button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col min-h-[500px]">
                <div className="bg-slate-900 border border-slate-800/60 rounded-2xl shadow-xl flex flex-col flex-1 overflow-hidden">
                  <div className="flex items-center px-6 border-b border-slate-800/60 shrink-0 bg-slate-950/30">
                    <button className={`py-4 px-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`} onClick={() => setActiveTab('timeline')}>Campaign Stages & Activity</button>
                    <button className={`py-4 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'notes' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`} onClick={() => setActiveTab('notes')}>Internal Notes <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[10px]">{notes.length}</span></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    {activeTab === 'timeline' && (
                      <div className="relative border-l-2 border-slate-800 ml-4 space-y-8 pb-4 animate-fade-in">
                        <div className="relative pl-8">
                          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"><FaCheckCircle size={14} /></div>
                          <div className="bg-slate-950/80 border border-emerald-500/30 p-5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                            <div className="flex justify-between items-start mb-2"><span className="text-sm font-bold text-emerald-400">Current Stage: {formData.status}</span><span className="text-xs text-slate-500">{formData.timestamp || "Just now"}</span></div>
                            <p className="text-sm text-slate-300 mb-3">{formData.lastActivity || "Reviewing proposal."}</p>
                            <span className="inline-block px-2.5 py-1 bg-slate-900 rounded-md border border-slate-800 text-[10px] text-slate-400 font-mono">Status: Awaiting action</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'notes' && (
                      <div className="animate-fade-in flex flex-col h-full">
                        <form onSubmit={handleAddNote} className="mb-8 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                          <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Log a call, add a note..." className="w-full bg-transparent border-none text-sm text-slate-200 outline-none resize-none h-16 custom-scrollbar placeholder:text-slate-600" />
                          <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-800/60">
                            <p className="text-[10px] text-slate-500">Visible to workspace</p>
                            <button type="submit" disabled={!newNote.trim()} className="px-4 py-1.5 bg-slate-800 hover:bg-indigo-600 disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors">Add Note</button>
                          </div>
                        </form>
                        <div className="space-y-4">
                          {notes.map(note => (
                            <div key={note.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-700 shrink-0">{note.author.charAt(0)}</div>
                              <div>
                                <div className="flex items-center gap-2 mb-1"><span className="text-xs font-bold text-slate-200">{note.author}</span><span className="text-[10px] text-slate-500">{note.time}</span></div>
                                <p className="text-sm text-slate-400 leading-relaxed">{note.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {isMessageModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in bg-[#020617]/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FaPaperPlane className="text-indigo-400" /> Message to {formData.name}
              </h3>
              <button onClick={() => setIsMessageModalOpen(false)} className="text-slate-500 hover:text-white"><FaTimes /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Platform</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-indigo-500">
                  <option>Email ({formData.email})</option>
                  <option>LinkedIn Direct Message</option>
                </select>
              </div>
              
              <div>
                <div className="flex justify-between mb-1.5 items-end">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">Message</label>
                  <button 
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI}
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 bg-indigo-500/10 px-2 py-1 rounded transition-colors disabled:opacity-50"
                  >
                    {isGeneratingAI ? <FaSpinner className="animate-spin" /> : <FaBrain />} 
                    {isGeneratingAI ? 'Writing...' : 'Use AI Template'}
                  </button>
                </div>
                <textarea 
                  rows="6"
                  value={messageDraft}
                  onChange={(e) => setMessageDraft(e.target.value)}
                  placeholder="Draft your message here or click 'Use AI Template' to let Groq write it for you..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500 custom-scrollbar resize-none"
                />
              </div>
            </div>

            <div className="p-5 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
              <button onClick={() => setIsMessageModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white font-medium">Cancel</button>
              <button 
                onClick={handleSendMessage}
                disabled={isSending || !messageDraft.trim()}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all"
              >
                {isSending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default LeadProfile;