// StatCard.jsx
function StatCard({ title, value, icon, className = "" }) {
  return (
    <div className={`bg-[#0f172a] p-6 rounded-2xl border border-slate-800/60 shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 group flex items-center justify-between overflow-hidden relative ${className}`}>
      
      {/* Subtle background glow effect on hover */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>

      <div className="z-10">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
        <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
      </div>

      <div className="w-14 h-14 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-indigo-400 text-2xl group-hover:scale-110 group-hover:text-indigo-300 group-hover:border-indigo-500/30 transition-all z-10 shadow-inner">
        {icon}
      </div>
    </div>
  );
}
export default StatCard;