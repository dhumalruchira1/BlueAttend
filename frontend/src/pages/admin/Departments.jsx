import { useEffect, useState } from 'react';
import api from '../../services/api.js';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', code: '' });

  const load = () => api.get('/admin/departments').then(r => setDepartments(r.data.departments));
  useEffect(load, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/admin/departments', form);
    setForm({ name: '', code: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="card grid sm:grid-cols-3 gap-3">
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
        <button className="btn-primary justify-center">Create Department</button>
      </form>
      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Departments</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {departments.map(d => (
            <div key={d._id} className="p-4 rounded-xl bg-bg border border-slate-100">
              <div className="font-semibold text-navy">{d.name}</div>
              <div className="text-xs text-slate-500">Code: {d.code}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}