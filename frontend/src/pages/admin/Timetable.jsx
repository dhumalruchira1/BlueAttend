import { useEffect, useState } from 'react';
import api from '../../services/api.js';

export default function ManageTimetable() {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [target, setTarget] = useState({ department: '', semester: 5, division: 'A' });
  const [tt, setTt] = useState(null);
  const [slot, setSlot] = useState({ day: 'Mon', startTime: '09:00', endTime: '10:00', subject: '', faculty: '', room: 'CS-101' });

  useEffect(() => {
    api.get('/admin/departments').then(r => setDepartments(r.data.departments));
    api.get('/admin/subjects').then(r => setSubjects(r.data.subjects));
    api.get('/users/faculty').then(r => setFaculty(r.data.faculty));
  }, []);

  const load = () => {
    if (!target.department) return;
    api.get('/admin/timetables', { params: target }).then(r => setTt(r.data.timetable));
  };
  useEffect(load, [target]);

  const addSlot = async () => {
    const slots = [...(tt?.slots || []), slot];
    const body = { ...target, slots };
    const r = await api.post('/admin/timetables', body);
    setTt(r.data.timetable);
  };

  return (
    <div className="space-y-6">
      <div className="card grid sm:grid-cols-3 gap-3">
        <select className="input" value={target.department} onChange={(e) => setTarget({ ...target, department: e.target.value })}>
          <option value="">Select department</option>
          {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
        <select className="input" value={target.semester} onChange={(e) => setTarget({ ...target, semester: Number(e.target.value) })}>
          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Sem {n}</option>)}
        </select>
        <select className="input" value={target.division} onChange={(e) => setTarget({ ...target, division: e.target.value })}>
          <option>A</option><option>B</option>
        </select>
      </div>

      <div className="card grid sm:grid-cols-6 gap-2">
        <select className="input" value={slot.day} onChange={(e) => setSlot({ ...slot, day: e.target.value })}>
          {['Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <option key={d}>{d}</option>)}
        </select>
        <input className="input" placeholder="Start" value={slot.startTime} onChange={(e) => setSlot({ ...slot, startTime: e.target.value })} />
        <input className="input" placeholder="End" value={slot.endTime} onChange={(e) => setSlot({ ...slot, endTime: e.target.value })} />
        <select className="input" value={slot.subject} onChange={(e) => setSlot({ ...slot, subject: e.target.value })}>
          <option value="">Subject</option>
          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <select className="input" value={slot.faculty} onChange={(e) => setSlot({ ...slot, faculty: e.target.value })}>
          <option value="">Faculty</option>
          {faculty.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
        </select>
        <input className="input" placeholder="Room" value={slot.room} onChange={(e) => setSlot({ ...slot, room: e.target.value })} />
        <button onClick={addSlot} className="btn-primary sm:col-span-6 justify-center">Add Slot</button>
      </div>

      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Timetable Slots</h3>
        {tt?.slots?.length ? tt.slots.map((s, i) => (
          <div key={s._id || i} className="py-2 border-b border-slate-50 text-sm">
            {s.day} {s.startTime}–{s.endTime} · {s.subject?.name || s.subject} · {s.room}
          </div>
        )) : <p className="text-sm text-slate-500">No slots yet.</p>}
      </div>
    </div>
  );
}