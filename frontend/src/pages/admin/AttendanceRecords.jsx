import { useEffect, useState } from 'react';
import api from '../../services/api.js';

export default function AttendanceRecords() {
  const [records, setRecords] = useState([]);
  useEffect(() => { api.get('/admin/attendance').then(r => setRecords(r.data.records)); }, []);

  return (
    <div className="card">
      <h3 className="font-semibold text-navy mb-4">All Attendance Records ({records.length})</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500 border-b border-slate-100"><th className="py-2">Student</th><th>Subject</th><th>Date</th><th>Method</th><th>Status</th></tr></thead>
          <tbody>
            {records.map(r => (
              <tr key={r._id} className="border-b border-slate-50">
                <td className="py-2">{r.student?.name} <span className="text-xs text-slate-500">({r.student?.rollNumber})</span></td>
                <td>{r.subject?.name}</td>
                <td>{r.date}</td>
                <td className="capitalize">{r.method}</td>
                <td><span className={r.status === 'present' ? 'badge-success' : 'badge-danger'}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}