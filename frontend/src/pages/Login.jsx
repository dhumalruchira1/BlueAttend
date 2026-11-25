import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: 'aarav@blueattend.io', password: 'student123' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const user = await login(form.email, form.password);
      nav(`/${user.role}`);
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block bg-gradient-to-br from-primary to-blue-700 relative">
        <div className="absolute inset-0 grid place-items-center text-white p-10">
          <div>
            <h2 className="text-3xl font-bold">Smart Attendance.<br />Verified Presence.</h2>
            <p className="mt-4 text-white/70 max-w-sm">Secure BLE sessions for colleges. No proxies. No spreadsheets.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Logo />
          <h1 className="mt-8 text-2xl font-bold text-navy">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to your account</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {err && <div className="p-3 rounded-lg bg-red-50 text-danger text-sm">{err}</div>}
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button className="btn-primary w-full justify-center" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          </form>
          <div className="mt-4 text-xs text-slate-400 text-center">
            Demo: aarav@blueattend.io / student123 · priya@blueattend.io / faculty123 · admin@blueattend.io / admin123
          </div>
          <p className="mt-6 text-sm text-center text-slate-500">
            New here? <Link to="/register" className="text-primary font-medium">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}