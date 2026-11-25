import { useState } from 'react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '' });
  const [saved, setSaved] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    await api.patch(`/users/${user._id}`, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary text-white grid place-items-center text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-navy">{user.name}</h3>
            <p className="text-sm text-slate-500 capitalize">{user.role} · {user.rollNumber || user.email}</p>
          </div>
        </div>
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div><dt className="text-slate-500">Email</dt><dd className="font-medium">{user.email}</dd></div>
          <div><dt className="text-slate-500">Roll Number</dt><dd className="font-medium">{user.rollNumber || '—'}</dd></div>
          <div><dt className="text-slate-500">Department</dt><dd className="font-medium">{user.department?.name || '—'}</dd></div>
          <div><dt className="text-slate-500">Semester</dt><dd className="font-medium">{user.semester || '—'}</dd></div>
        </dl>
      </div>

      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Edit Profile</h3>
        <form onSubmit={submit} className="space-y-3">
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
          <button className="btn-primary">Save changes</button>
          {saved && <span className="ml-3 text-success text-sm">Saved ✓</span>}
        </form>
      </div>
    </div>
  );
}