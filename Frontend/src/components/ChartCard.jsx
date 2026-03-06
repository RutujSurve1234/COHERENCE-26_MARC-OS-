// ChartCard.jsx
function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`bg-[#0f172a] p-6 lg:p-7 rounded-2xl border border-slate-800/60 shadow-lg transition-all duration-300 hover:border-slate-700/60 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-100 tracking-tight">
          {title}
        </h3>
        <button className="text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 hover:border-indigo-500/30">
          View Details
        </button>
      </div>
      <div className="w-full relative">
        {children}
      </div>
    </div>
  );
}
export default ChartCard;