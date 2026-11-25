import { Bluetooth, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', to = '/' }) {
  const dims = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' }[size];
  const icon = { sm: 14, md: 18, lg: 22 }[size];
  const text = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }[size];
  return (
    <Link to={to} className="flex items-center gap-2.5">
      <div className={`relative ${dims} rounded-xl bg-primary text-white grid place-items-center shadow-soft`}>
        <Bluetooth size={icon} strokeWidth={2.5} />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success grid place-items-center ring-2 ring-white">
          <Check size={10} strokeWidth={3} className="text-white" />
        </div>
      </div>
      <span className={`font-bold ${text} tracking-tight text-navy`}>BlueAttend</span>
    </Link>
  );
}
