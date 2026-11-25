import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api.js';
import { formatDate } from '../../utils/format.js';

export default function MyAttendance() {
  const [records, setRecords] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    api.get('/attendance/my-history').then(r => setRecords(r.data.records));
    api.get('/attendance/my-subject-wise').then(r => setSubjects(r.data.subjects));
  }, []);

  const monthly = records.reduce((acc, r) => {
    const m = r.date.slice(0, 7);
    if (!acc[m]) acc[m] = { month: m, present: 0, absent: 0 };
    if (r.status === 'present') acc[m].present += 1; else acc[m].absent += 1;
    return acc;
  }, {});
  const chartData = Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Subject-wise Attendance</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map(s => {
            const pct = s.total ? Math.round((s.present / s.total) * 100) : 0;
            return (
              <div key={s._id} className="p-4 rounded-xl border border-slate-100 bg-bg">
                <div className="text-sm font-medium text-navy">{s.subject?.name}</div>
                <div className="text-xs text-slate-500 mb-2">{s.subject?.code}</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">{s.present}/{s.total}</span>
                  <span className={`font-bold ${pct >= 75 ? 'text-success' : 'text-warn'}`}>{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className={`h-full ${pct >= 75 ? 'bg-success' : 'bg-warn'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          {subjects.length === 0 && <p className="text-sm text-slate-500">No subject data yet.</p>}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Monthly Trend</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="present" fill="#16A34A" radius={[6, 6, 0, 0]} />
              <Bar dataKey="absent" fill="#DC2626" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Full History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="py-2">Date</th><th>Subject</th><th>Method</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r._id} className="border-b border-slate-50">
                  <td className="py-2.5">{formatDate(r.date)}</td>
                  <td>{r.subject?.name}</td>
                  <td className="capitalize">{r.method}</td>
                  <td><span className={r.status === 'present' ? 'badge-success' : 'badge-danger'}>{r.status}</span></td>
                </tr>
              ))}
              {records.length === 0 && <tr><td colSpan={4} className="text-center py-6 text-slate-500">No records yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}