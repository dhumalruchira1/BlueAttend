import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Loader2 } from 'lucide-react';

export default function ManualAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState('');

  useEffect(() => {
    api.get('/admin/subjects').then(r => setSubjects(r.data.subjects));
    api.get('/users/students').then(r => setStudents(r.data.students));
  }, []);

  const saveAll = async () => {
    setBusy(true); setSaved('');
    try {
      const entries = Object.entries(statuses);
      for (const [studentId, status] of entries) {
        await api.post('/attendance/manual', { studentId, subjectId, date, status });
      }
      setSaved(`Saved ${entries.length} records ✓`);
    } finally { setBusy(false); }
  };

  return (
    <div className="card space-y-4">
      <h3 className="font-semibold text-navy">Manual Attendance</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <select className="input" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          <option value="">Select subject</option>
          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500 border-b border-slate-100"><th className="py-2">Student</th><th>Roll No</th><th>Status</th></tr></thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id} className="border-b border-slate-50">
                <td className="py-2">{s.name}</td>
                <td>{s.rollNumber}</td>
                <td>
                  <div className="flex gap-2">
                    {['present','absent'].map(st => (
                      <button key={st} onClick={() => setStatuses(prev => ({ ...prev, [s._id]: st }))}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border ${statuses[s._id] === st ? (st === 'present' ? 'bg-success text-white border-success' : 'bg-danger text-white border-danger') : 'bg-white border-slate-200'}`}>
                        {st}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={saveAll} disabled={busy || !subjectId} className="btn-primary">
          {busy ? <Loader2 className="animate-spin" size={16} /> : 'Save attendance'}
        </button>
        {saved && <span className="text-sm text-success">{saved}</span>}
      </div>
    </div>
  );
}