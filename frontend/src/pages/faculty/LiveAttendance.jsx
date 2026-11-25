import { useEffect, useState } from 'react';
import { Users, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';
import { useSocket } from '../../context/SocketContext.jsx';
import { formatTime } from '../../utils/format.js';

export default function LiveAttendance() {
  const { socket } = useSocket();
  const [session, setSession] = useState(null);
  const [records, setRecords] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);

  useEffect(() => {
    api.get('/attendance/sessions/active').then(r => {
      setActiveSessions(r.data.sessions);
      if (r.data.sessions[0]) pick(r.data.sessions[0]);
    });
  }, []);

  const pick = async (s) => {
    setSession(s);
    const r = await api.get(`/attendance/sessions/${s.sessionId}/live`);
    setRecords(r.data.records);
  };

  useEffect(() => {
    if (!socket || !session) return;
    socket.emit('join-session', session.sessionId);
    const onNew = (data) => {
      setRecords(prev => [{ _id: Date.now(), student: { name: data.name, rollNumber: data.rollNumber }, status: 'present', verification: { verifiedAt: new Date() } }, ...prev]);
    };
    socket.on('attendance:new', onNew);
    return () => { socket.off('attendance:new', onNew); socket.emit('leave-session', session.sessionId); };
  }, [socket, session]);

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="font-semibold text-navy mb-3">Active Sessions</h3>
        <div className="flex flex-wrap gap-2">
          {activeSessions.map(s => (
            <button key={s._id} onClick={() => pick(s)} className={`px-3 py-2 rounded-lg border text-sm ${session?._id === s._id ? 'bg-primary text-white border-primary' : 'bg-white border-slate-200'}`}>
              {s.subject.name} · {s.room}
            </button>
          ))}
          {activeSessions.length === 0 && <p className="text-sm text-slate-500">No active sessions.</p>}
        </div>
      </div>

      {session && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="card flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-100 text-success grid place-items-center"><CheckCircle2 size={20} /></div>
              <div><div className="text-sm text-slate-500">Present</div><div className="text-2xl font-bold text-navy">{records.length}</div></div>
            </div>
            <div className="card flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary grid place-items-center"><Users size={20} /></div>
              <div><div className="text-sm text-slate-500">Session</div><div className="text-lg font-bold text-navy font-mono">{session.sessionId}</div></div>
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold text-navy mb-4">Live Attendance Feed</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-slate-500 border-b border-slate-100"><th className="py-2">Student</th><th>Roll No</th><th>Time</th><th>Status</th></tr></thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r._id} className="border-b border-slate-50">
                      <td className="py-2.5">{r.student?.name}</td>
                      <td>{r.student?.rollNumber}</td>
                      <td>{r.verification?.verifiedAt ? formatTime(r.verification.verifiedAt) : '—'}</td>
                      <td><span className="badge-success">{r.status}</span></td>
                    </tr>
                  ))}
                  {records.length === 0 && <tr><td colSpan={4} className="text-center py-6 text-slate-500">Waiting for students…</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}