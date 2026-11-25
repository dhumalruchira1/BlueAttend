import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Loader2, AlertTriangle } from 'lucide-react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function StartAttendance() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ subjectId: '', departmentId: '', semester: 5, division: 'A', room: 'CS-101', durationMinutes: 5 });
  const [session, setSession] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/admin/subjects').then(r => setSubjects(r.data.subjects));
    api.get('/admin/departments').then(r => setDepartments(r.data.departments));
  }, []);

  const start = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const r = await api.post('/attendance/sessions', form);
      setSession(r.data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to start session');
    } finally { setBusy(false); }
  };

  const stop = async () => {
    await api.patch(`/attendance/sessions/${session.session._id}/end`);
    setSession(null);
  };

  if (session) {
    return (
      <div className="max-w-xl mx-auto card text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary text-white grid place-items-center mb-4 animate-pulse">
          <Radio size={28} />
        </div>
        <h3 className="text-lg font-bold text-navy">Session is Live</h3>
        <p className="text-sm text-slate-500">Broadcast this token from your BLE beacon.</p>
        <div className="mt-6 p-4 rounded-xl bg-bg border border-slate-100 text-left">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Session ID</div>
          <div className="font-mono font-bold text-navy text-lg">{session.session.sessionId}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wide mt-3">Verification Token (faculty-only)</div>
          <div className="font-mono text-xs break-all bg-white p-2 rounded border border-slate-200 mt-1">{session.token}</div>
          <p className="text-xs text-warn mt-3 flex items-start gap-1">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" /> This token must only be advertised by a trusted BLE beacon. Do not share it.
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={stop} className="btn-danger flex-1 justify-center">Stop session</button>
          <button onClick={() => nav('/faculty/live')} className="btn-outline flex-1 justify-center">View Live</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={start} className="max-w-xl card space-y-4">
      <h3 className="font-semibold text-navy">Start Attendance Session</h3>
      {err && <div className="p-3 rounded-lg bg-red-50 text-danger text-sm">{err}</div>}
      <select className="input" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} required>
        <option value="">Select subject</option>
        {subjects.filter(s => String(s.faculty?._id) === String(user._id)).map(s => (
          <option key={s._id} value={s._id}>{s.name} · {s.code}</option>
        ))}
      </select>
      <select className="input" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} required>
        <option value="">Select department</option>
        {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <select className="input" value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}>
          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
        </select>
        <select className="input" value={form.division} onChange={(e) => setForm({ ...form, division: e.target.value })}>
          <option>A</option><option>B</option>
        </select>
      </div>
      <input className="input" placeholder="Room (e.g. CS-101)" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} required />
      <input type="number" min={1} max={30} className="input" placeholder="Duration (minutes)" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} required />
      <button disabled={busy} className="btn-primary w-full justify-center">
        {busy ? <Loader2 className="animate-spin" size={16} /> : 'Start session'}
      </button>
      <p className="text-xs text-slate-500">
        Note: browsers cannot broadcast BLE. Use a supported beacon or the planned Android companion app to advertise the token.
      </p>
    </form>
  );
}