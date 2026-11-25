import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardLayout() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-navy">
                {user?.role === 'student' ? 'Student Dashboard' : user?.role === 'faculty' ? 'Faculty Dashboard' : 'Admin Dashboard'}
              </h1>
              <p className="text-xs text-slate-500">Welcome back, {user?.name?.split(' ')[0]}</p>
            </div>
            <button className="relative w-10 h-10 rounded-lg border border-slate-200 grid place-items-center hover:border-primary transition">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}