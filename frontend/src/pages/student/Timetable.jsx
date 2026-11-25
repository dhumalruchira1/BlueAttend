import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat'];

export default function Timetable() {
  const { user } = useAuth();
  const [tt, setTt] = useState(null);
  useEffect(() => {
    if (!user?.department?._id) return;
    api.get('/admin/timetables', { params: { department: user.department._id, semester: user.semester, division: user.division } })
      .then(r => setTt(r.data.timetable));
  }, [user]);

  return (
    <div className="card">
      <h3 className="font-semibold text-navy mb-4">Weekly Timetable</h3>
      {!tt ? <p className="text-sm text-slate-500">No timetable found.</p> : (
        <div className="grid md:grid-cols-3 gap-4">
          {DAYS.map(day => (
            <div key={day} className="rounded-xl border border-slate-100 p-3 bg-bg">
              <div className="font-semibold text-navy mb-2">{day}</div>
              <div className="space-y-2">
                {tt.slots.filter(s => s.day === day).map(s => (
                  <div key={s._id} className="bg-white rounded-lg p-2.5 border border-slate-100">
                    <div className="text-sm font-medium text-navy">{s.subject?.name}</div>
                    <div className="text-xs text-slate-500">{s.startTime}–{s.endTime} · {s.room}</div>
                  </div>
                ))}
                {tt.slots.filter(s => s.day === day).length === 0 && <p className="text-xs text-slate-400">No classes</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}