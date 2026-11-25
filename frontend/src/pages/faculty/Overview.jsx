import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Radio, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../services/api.js';
import StatCard from '../../components/StatCard.jsx';

export default function FacultyOverview() {
  const [stats, setStats] = useState({ totalStudents: 0, classesTaken: 0, present: 0, absent: 0 });
  const [sessions, setSessions] = useState([]);
  const [concerns, setConcerns] = useState([]);

  useEffect(() => {
    api.get('/analytics/faculty').then(r => setStats(r.data));
    api.get('/attendance/sessions/active').then(r => setSessions(r.data.sessions));
    api.get('/concerns/faculty').then(r => setConcerns(r.data.concerns.filter(c => c.status === 'pending')));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents} tint="navy" />
        <StatCard icon={Radio} label="Classes Taken" value={stats.classesTaken} tint="blue" />
        <StatCard icon={CheckCircle2} label="Present" value={stats.present} tint="green" />
        <StatCard icon={XCircle} label="Absent" value={stats.absent} tint="red" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy">Active Sessions</h3>
            <Link to="/faculty/start" className="text-sm text-primary font-medium">Start new</Link>
          </div>
          {sessions.length === 0 ? <p className="text-sm text-slate-500">No active sessions.</p> : (
            <div className="space-y-2">
              {sessions.map(s => (
                <div key={s._id} className="flex items-center justify-between p-3 rounded-lg bg-bg border border-slate-100">
                  <div>
                    <div className="text-sm font-medium text-navy">{s.subject.name}</div>
                    <div className="text-xs text-slate-500">{s.room}</div>
                  </div>
                  <Link to="/faculty/live" className="text-sm text-primary">Live →</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy">Pending Concerns</h3>
            <Link to="/faculty/concerns" className="text-sm text-primary font-medium">View all</Link>
          </div>
          {concerns.length === 0 ? <p className="text-sm text-slate-500">All caught up!</p> : (
            <div className="space-y-2">
              {concerns.slice(0, 4).map(c => (
                <div key={c._id} className="p-3 rounded-lg bg-bg border border-slate-100">
                  <div className="text-sm font-medium text-navy">{c.student?.name}</div>
                  <div className="text-xs text-slate-500">{c.subject?.name} · {c.attendanceDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}