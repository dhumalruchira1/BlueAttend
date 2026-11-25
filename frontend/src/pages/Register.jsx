import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/Logo.jsx';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', rollNumber: '', department: 'CS', semester: 5, division: 'A' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const user = await register(form);
      nav(`/${user.role}`);
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div className="w-full max-w-lg">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold text-navy">Create your account</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {err && <div className="p-3 rounded-lg bg-red-50 text-danger text-sm">{err}</div>}
          <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" type="password" placeholder="Password (min 6 chars)" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
          {form.role === 'student' && (
            <>
              <input className="input" placeholder="Roll number (e.g. CS21A099)" value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <select className="input" value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
                </select>
                <select className="input" value={form.division} onChange={(e) => setForm({ ...form, division: e.target.value })}>
                  <option>A</option><option>B</option>
                </select>
              </div>
            </>
          )}
          <input className="input" placeholder="Department code (CS / IT)" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <button className="btn-primary w-full justify-center" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        </form>
        <p className="mt-6 text-sm text-center text-slate-500">
          Already have an account? <Link to="/login" className="text-primary font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}