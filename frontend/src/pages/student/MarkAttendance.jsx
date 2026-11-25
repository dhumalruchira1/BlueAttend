import { useEffect, useState } from 'react';
import { Bluetooth, AlertTriangle, CheckCircle2, Clock, Loader2, Radio } from 'lucide-react';
import api from '../../services/api.js';
import { isBLESupported, scanForSessionToken } from '../../services/ble.js';
import { daysLeft } from '../../utils/format.js';

export default function MarkAttendance() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const bleSupported = isBLESupported();

  const load = () => {
    setLoading(true);
    api.get('/attendance/sessions/active')
      .then(r => setSessions(r.data.sessions))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markViaBLE = async (session) => {
    setStatus({ type: '', msg: '' });
    setBusy(session._id);
    try {
      const { token, rssi, deviceInfo } = await scanForSessionToken(session.sessionId);
      await api.post('/attendance/mark-bluetooth', {
        sessionId: session.sessionId, token, rssi, deviceInfo,
      });
      setStatus({ type: 'success', msg: `Attendance marked for ${session.subject.name}.` });
      load();
    } catch (e) {
      setStatus({ type: 'error', msg: e.message || 'Could not verify session.' });
    } finally { setBusy(null); }
  };

  return (
    <div className="space-y-6">
      <div className={`card flex items-start gap-3 ${bleSupported ? 'border-green-200 bg-green-50/40' : 'border-amber-200 bg-amber-50/40'}`}>
        {bleSupported ? <CheckCircle2 className="text-success mt-0.5" size={20} /> : <AlertTriangle className="text-warn mt-0.5" size={20} />}
        <div>
          <div className="font-semibold text-navy">
            Bluetooth {bleSupported ? 'available' : 'not supported in this browser'}
          </div>
          <p className="text-sm text-slate-600">
            {bleSupported
              ? 'You will be asked for permission to scan for the classroom beacon.'
              : 'Please use a supported browser or raise a manual concern from the student concerns page.'}
          </p>
        </div>
      </div>

      {status.msg && (
        <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>
          {status.msg}
        </div>
      )}

      {loading ? <div className="text-center text-slate-500 py-10"><Loader2 className="animate-spin inline" /></div> : sessions.length === 0 ? (
        <div className="card text-center py-12">
          <Radio className="mx-auto text-slate-300" size={40} />
          <h3 className="mt-3 font-semibold text-navy">No active sessions</h3>
          <p className="text-sm text-slate-500">Your faculty hasn't started a session yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {sessions.map(s => (
            <div key={s._id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-info"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live</span>
                    <span className="text-xs text-slate-500">{s.room}</span>
                  </div>
                  <h3 className="font-bold text-navy">{s.subject.name}</h3>
                  <p className="text-sm text-slate-500">{s.faculty.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary flex items-center gap-1"><Clock size={18} /> {daysLeft(s.expiresAt)}s</div>
                  <div className="text-xs text-slate-500">remaining</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  disabled={!bleSupported || busy === s._id}
                  onClick={() => markViaBLE(s)}
                  className="btn-primary flex-1 justify-center disabled:opacity-50"
                >
                  {busy === s._id ? <><Loader2 className="animate-spin" size={16} /> Verifying…</> : <><Bluetooth size={16} /> Mark via Bluetooth</>}
                </button>
              </div>
              {!bleSupported && (
                <p className="mt-2 text-xs text-warn">Bluetooth not available — use the concern fallback from the Concerns page.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}