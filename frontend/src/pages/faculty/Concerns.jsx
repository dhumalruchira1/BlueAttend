import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function FacultyConcerns() {
  const [concerns, setConcerns] = useState([]);
  const [remarks, setRemarks] = useState({});

  const load = () => api.get('/concerns/faculty').then(r => setConcerns(r.data.concerns));
  useEffect(load, []);

  const resolve = async (id, action) => {
    await api.patch(`/concerns/${id}/resolve`, { action, remarks: remarks[id] || '' });
    load();
  };

  return (
    <div className="space-y-4">
      {concerns.length === 0 && <div className="card text-center text-slate-500 py-10">No concerns yet.</div>}
      {concerns.map(c => (
        <div key={c._id} className="card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-navy">{c.student?.name} <span className="text-xs text-slate-500">({c.student?.rollNumber})</span></div>
              <div className="text-sm text-slate-500">{c.subject?.name} · {c.attendanceDate}</div>
            </div>
            <span className={`badge-${c.status === 'pending' ? 'warn' : c.status === 'approved' ? 'success' : 'danger'}`}>{c.status}</span>
          </div>
          <p className="mt-3 text-sm text-slate-600 bg-bg p-3 rounded-lg">{c.reason}</p>
          {c.status === 'pending' && (
            <>
              <input className="input mt-3" placeholder="Remarks (optional)" value={remarks[c._id] || ''} onChange={(e) => setRemarks({ ...remarks, [c._id]: e.target.value })} />
              <div className="mt-3 flex gap-2">
                <button onClick={() => resolve(c._id, 'approve')} className="btn-primary"><CheckCircle2 size={16} /> Approve</button>
                <button onClick={() => resolve(c._id, 'reject')} className="btn-danger"><XCircle size={16} /> Reject</button>
              </div>
            </>
          )}
          {c.facultyRemarks && <p className="mt-2 text-xs text-primary">Remarks: {c.facultyRemarks}</p>}
        </div>
      ))}
    </div>
  );
}