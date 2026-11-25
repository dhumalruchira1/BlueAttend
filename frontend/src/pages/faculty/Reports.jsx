import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Download } from 'lucide-react';

export default function FacultyReports() {
  const [records, setRecords] = useState([]);
  useEffect(() => {
    api.get('/admin/attendance').then(r => setRecords(r.data.records));
  }, []);

  const downloadCSV = () => {
    const rows = [['Student','Roll','Subject','Date','Status','Method']];
    records.forEach(r => rows.push([r.student?.name, r.student?.rollNumber, r.subject?.name, r.date, r.status, r.method]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `attendance-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-navy">Reports</h3>
        <button onClick={downloadCSV} className="btn-primary"><Download size={16} /> Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500 border-b border-slate-100"><th className="py-2">Student</th><th>Subject</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {records.map(r => (
              <tr key={r._id} className="border-b border-slate-50">
                <td className="py-2">{r.student?.name}</td>
                <td>{r.subject?.name}</td>
                <td>{r.date}</td>
                <td><span className={r.status === 'present' ? 'badge-success' : 'badge-danger'}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}