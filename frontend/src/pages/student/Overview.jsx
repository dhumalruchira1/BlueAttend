import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, XCircle, Percent, Calendar, Bell } from 'lucide-react';
import api from '../../services/api.js';
import StatCard from '../../components/StatCard.jsx';
import { formatDate } from '../../utils/format.js';

export default function StudentOverview() {
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, percent: 0 });
  const [recent, setRecent] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/analytics/student').then(r => setStats(r.data));
    api.get('/attendance/my-history').then(r => setRecent(r.data.records.slice(0, 5)));
    api.get('/notifications').then(r => setNotifications(r.data.notifications.slice(0, 4)));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Total Classes" value={stats.total} tint="navy" />
        <StatCard icon={CheckCircle2} label="Present" value={stats.present} tint="green" />
        <StatCard icon={XCircle} label="Absent" value={stats.absent} tint="red" />
        <StatCard icon={Percent} label="Attendance" value={`${stats.percent}%`} tint="blue" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy flex items-center gap-2"><Calendar size={18} /> Recent Attendance</h3>
            <Link to="/student/attendance" className="text-sm text-primary font-medium">View all</Link>
          </div>
          {recent.length === 0 ? <p className="text-sm text-slate-500">No records yet.</p> : (
            <div className="divide-y divide-slate-100">
              {recent.map(r => (
                <div key={r._id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-navy">{r.subject?.name}</div>
                    <div className="text-xs text-slate-500">{formatDate(r.date)}</div>
                  </div>
                  <span className={r.status === 'present' ? 'badge-success' : 'badge-danger'}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy flex items-center gap-2"><Bell size={18} /> Notifications</h3>
          </div>
          {notifications.length === 0 ? <p className="text-sm text-slate-500">No notifications.</p> : (
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n._id} className="p-3 rounded-lg bg-bg border border-slate-100">
                  <div className="text-sm font-medium text-navy">{n.title}</div>
                  <div className="text-xs text-slate-500">{n.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link to="/student/mark" className="btn-primary justify-center">Mark Attendance</Link>
          <Link to="/student/concerns" className="btn-outline justify-center">Raise Concern</Link>
          <Link to="/student/timetable" className="btn-outline justify-center">View Timetable</Link>
        </div>
      </div>
    </div>
  );
}