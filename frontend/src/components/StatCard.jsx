export default function StatCard({ icon: Icon, label, value, tint = 'blue', hint }) {
  const tints = {
    blue:   'bg-primary/10 text-primary',
    green:  'bg-green-100 text-success',
    amber:  'bg-amber-100 text-warn',
    red:    'bg-red-100 text-danger',
    navy:   'bg-navy/10 text-navy',
  };
  return (
    <div className="card flex items-center gap-4 hover:shadow-lg transition">
      <div className={`w-12 h-12 rounded-xl grid place-items-center ${tints[tint]}`}>
        {Icon && <Icon size={22} />}
      </div>
      <div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-2xl font-bold text-navy">{value}</div>
        {hint && <div className="text-xs text-slate-400">{hint}</div>}
      </div>
    </div>
  );
}