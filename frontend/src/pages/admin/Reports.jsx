import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Download } from 'lucide-react';

export default function AdminReports() {
  const [records, setRecords] = useState([]);
  useEffect(() => { api.get('/admin/attendance').then(r => setRecords(r.data.records)); }, []);

  const download = () => {
    const rows = [['Student','Roll','Subject','Date','Status','Method']];
    records.forEach(r => rows.push([r.student?.name, r.student?.rollNumber, r.subject?.name, r.date, r.status, r.method]));
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `blueattend-report-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-navy">Export Reports</h3>
        <button onClick={download} className="btn-primary"><Download size={16} /> Download CSV</button>
      </div>
      <p className="text-sm text-slate-500">Export all attendance records to CSV for analysis or compliance.</p>
    </div>
  );
}