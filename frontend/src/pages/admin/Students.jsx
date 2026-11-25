import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Plus } from 'lucide-react';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: 'student123', rollNumber: '', semester: 5, division: 'A', department: '' });
  const [departments, setDepartments] = useState([]);

  const load = () => api.get('/users/students').then(r => setStudents(r.data.students));
  useEffect(() => {
    load();
    api.get('/admin/departments').then(r => setDepartments(r.data.departments));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/users/students', form);
    setForm({ ...form, name: '', email: '', rollNumber: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="card grid sm:grid-cols-3 gap-3">
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" placeholder="Roll Number" value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} required />
        <select className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required>
          <option value="">Department</option>
          {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
        <select className="input" value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}>
          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Sem {n}</option>)}
        </select>
        <button className="btn-primary justify-center"><Plus size={16} /> Add Student</button>
      </form>

      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Students ({students.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500 border-b border-slate-100"><th className="py-2">Name</th><th>Roll</th><th>Email</th><th>Sem</th><th>Status</th></tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id} className="border-b border-slate-50">
                  <td className="py-2">{s.name}</td>
                  <td>{s.rollNumber}</td>
                  <td>{s.email}</td>
                  <td>{s.semester}</td>
                  <td><span className={s.isActive ? 'badge-success' : 'badge-danger'}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}