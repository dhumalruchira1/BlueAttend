import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Loader2 } from 'lucide-react';

export default function StudentConcerns() {
  const [subjects, setSubjects] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [form, setForm] = useState({ subjectId: '', attendanceDate: '', reason: '' });
  const [busy, setBusy] = useState(false);

  const load = () => api.get('/concerns/my').then(r => setConcerns(r.data.concerns));
  useEffect(() => {
    api.get('/attendance/my-subject-wise').then(r => setSubjects(r.data.subjects));
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/concerns', form);
      setForm({ subjectId: '', attendanceDate: '', reason: '' });
      load();
    } finally { setBusy(false); }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Raise a Concern</h3>
        <form onSubmit={submit} className="space-y-3">
          <select className="input" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} required>
            <option value="">Select subject</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.subject?.name}</option>)}
          </select>
          <input type="date" className="input" value={form.attendanceDate} onChange={(e) => setForm({ ...form, attendanceDate: e.target.value })} required />
          <textarea className="input min-h-[100px]" placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
          <button disabled={busy} className="btn-primary w-full justify-center">
            {busy ? <Loader2 className="animate-spin" size={16} /> : 'Submit concern'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 className="font-semibold text-navy mb-4">My Concerns</h3>
        <div className="space-y-3">
          {concerns.map(c => (
            <div key={c._id} className="p-3 rounded-lg bg-bg border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-navy">{c.subject?.name}</span>
                <span className={`badge-${c.status === 'pending' ? 'warn' : c.status === 'approved' ? 'success' : 'danger'}`}>{c.status}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{c.attendanceDate}</div>
              <p className="text-sm text-slate-600 mt-1">{c.reason}</p>
              {c.facultyRemarks && <p className="text-xs mt-2 text-primary">Faculty: {c.facultyRemarks}</p>}
            </div>
          ))}
          {concerns.length === 0 && <p className="text-sm text-slate-500">No concerns yet.</p>}
        </div>
      </div>
    </div>
  );
}