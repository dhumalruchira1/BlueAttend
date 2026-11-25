import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Plus } from 'lucide-react';

export default function ManageFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: 'faculty123', employeeId: '', department: '' });

  const load = () => api.get('/users/faculty').then(r => setFaculty(r.data.faculty));
  useEffect(() => { load(); api.get('/admin/departments').then(r => setDepartments(r.data.departments)); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/users/faculty', form);
    setForm({ ...form, name: '', email: '', employeeId: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="card grid sm:grid-cols-3 gap-3">
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" placeholder="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
        <select className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required>
          <option value="">Department</option>
          {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
        <button className="btn-primary justify-center sm:col-span-2"><Plus size={16} /> Add Faculty</button>
      </form>

      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Faculty ({faculty.length})</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500 border-b border-slate-100"><th className="py-2">Name</th><th>Employee ID</th><th>Email</th></tr></thead>
          <tbody>
            {faculty.map(f => (
              <tr key={f._id} className="border-b border-slate-50">
                <td className="py-2">{f.name}</td>
                <td>{f.employeeId}</td>
                <td>{f.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}