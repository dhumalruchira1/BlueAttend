import { useEffect, useState } from 'react';
import { Users, GraduationCap, Building2, Radio } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api.js';
import StatCard from '../../components/StatCard.jsx';

export default function AdminOverview() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/analytics/admin').then(r => setData(r.data)); }, []);
  if (!data) return <div className="text-slate-500">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label="Students" value={data.students} tint="navy" />
        <StatCard icon={Users} label="Faculty" value={data.faculty} tint="blue" />
        <StatCard icon={Building2} label="Departments" value={data.departments} tint="green" />
        <StatCard icon={Radio} label="Sessions" value={data.sessions} tint="amber" />
      </div>

      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Department Sizes</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={data.deptStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="code" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}