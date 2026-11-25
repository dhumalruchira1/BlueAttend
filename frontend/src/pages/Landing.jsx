import { Link } from 'react-router-dom';
import { Bluetooth, ShieldCheck, Zap, Users, BarChart3, CheckCircle2, GraduationCap } from 'lucide-react';
import Logo from '../components/Logo.jsx';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b border-slate-100 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how" className="hover:text-primary">How it works</a>
            <a href="#features" className="hover:text-primary">Features</a>
            <a href="#benefits" className="hover:text-primary">Benefits</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-outline text-sm">Login</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lightblue text-primary text-xs font-semibold mb-4">
            <Bluetooth size={14} /> BLE Verified Attendance
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-navy leading-tight">
            Attendance Made <span className="text-primary">Smarter.</span>
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-lg">
            BlueAttend uses secure Bluetooth Low Energy sessions to verify presence in the classroom — no more roll calls, no more proxy attendance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-outline">Login</Link>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-success" /> Secure sessions</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-success" /> Real-time updates</div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary to-blue-700 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 p-6 text-white">
              <Bluetooth size={40} />
              <div className="mt-4 text-2xl font-bold">Session Live</div>
              <div className="text-white/70 text-sm">CS-101 · Data Structures</div>
              <div className="mt-6 space-y-2">
                {['Aarav Patel','Isha Verma','Karan Singh'].map((n) => (
                  <div key={n} className="flex items-center justify-between bg-white/20 rounded-lg px-3 py-2 text-sm">
                    <span>{n}</span>
                    <span className="text-emerald-300 font-semibold">Present</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-bg py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy text-center">How it works</h2>
          <p className="text-center text-slate-500 mt-2">Three steps. Under 30 seconds.</p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, t: 'Faculty starts session', d: 'A unique, short-lived token is generated for the class.' },
              { icon: Bluetooth, t: 'Beacon broadcasts', d: 'The classroom BLE beacon advertises the session ID.' },
              { icon: ShieldCheck, t: 'Student verified', d: 'Student device scans, verifies and attendance is recorded instantly.' },
            ].map((s, i) => (
              <div key={i} className="card">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4"><s.icon size={20} /></div>
                <h3 className="font-semibold text-navy">{s.t}</h3>
                <p className="text-sm text-slate-600 mt-2">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy text-center">Powerful features</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { icon: Bluetooth, t: 'BLE Sessions', d: 'Crypto-verified, short-lived session tokens.' },
              { icon: BarChart3, t: 'Analytics', d: 'Live dashboards for faculty, admins and students.' },
              { icon: Users, t: 'Role-based Access', d: 'Separate portals for students, faculty and admins.' },
              { icon: ShieldCheck, t: 'Secure by default', d: 'JWT, bcrypt, audit logs and duplicate prevention.' },
              { icon: Zap, t: 'Real-time', d: 'Socket.io live attendance updates.' },
              { icon: GraduationCap, t: 'Concern Workflow', d: 'Students raise concerns, faculty resolve them.' },
            ].map((f, i) => (
              <div key={i} className="card">
                <div className="w-11 h-11 rounded-xl bg-lightblue text-primary grid place-items-center mb-4"><f.icon size={20} /></div>
                <h3 className="font-semibold text-navy">{f.t}</h3>
                <p className="text-sm text-slate-600 mt-2">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="bg-navy text-white py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">For Students</h3>
            <ul className="space-y-3 text-white/80">
              {['Mark attendance in seconds','View subject-wise analytics','Raise concerns with a single tap','Never miss a class again'].map(t => (
                <li key={t} className="flex items-center gap-2"><CheckCircle2 size={18} className="text-success" />{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">For Faculty</h3>
            <ul className="space-y-3 text-white/80">
              {['Start sessions with one click','Live attendance in real-time','Approve/deny concerns with remarks','Download CSV reports'].map(t => (
                <li key={t} className="flex items-center gap-2"><CheckCircle2 size={18} className="text-success" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} BlueAttend — Smart Attendance. Verified Presence.
      </footer>
    </div>
  );
}