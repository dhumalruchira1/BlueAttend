import { useEffect, useState } from 'react';
import api from '../../services/api.js';

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({ name: '', code: '', department: '', semester: 5, faculty: '' });

  const load = () => api.get('/admin/subjects').then(r => setSubjects(r.data.subjects));
  useEffect(() => {
    load();
    api.get('/admin/departments').then(r => setDepartments(r.data.departments));
    api.get('/users/faculty').then(r => setFaculty(r.data.faculty));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/admin/subjects', form);
    setForm({ ...form, name: '', code: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="card grid sm:grid-cols-3 gap-3">
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
        <select className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required>
          <option value="">Department</option>
          {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
        <select className="input" value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}>
          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Sem {n}</option>)}
        </select>
        <select className="input" value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })}>
          <option value="">Assign faculty</option>
          {faculty.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
        </select>
        <button className="btn-primary justify-center">Add Subject</button>
      </form>
      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Subjects ({subjects.length})</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500 border-b border-slate-100"><th className="py-2">Name</th><th>Code</th><th>Sem</th><th>Faculty</th></tr></thead>
          <tbody>
            {subjects.map(s => (
              <tr key={s._id} className="border-b border-slate-50">
                <td className="py-2">{s.name}</td>
                <td>{s.code}</td>
                <td>{s.semester}</td>
                <td>{s.faculty?.name || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}