import { NavLink } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard, CalendarCheck, History, MessageSquareWarning,
  CalendarDays, User, Radio, ListChecks, Users, FileBarChart,
  Building2, BookOpen, Clock, ClipboardList, GraduationCap, LogOut
} from 'lucide-react';

const NAV = {
  student: [
    { to: '/student', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/student/mark', label: 'Mark Attendance', icon: CalendarCheck },
    { to: '/student/attendance', label: 'My Attendance', icon: History },
    { to: '/student/concerns', label: 'Raise Concern', icon: MessageSquareWarning },
    { to: '/student/timetable', label: 'Timetable', icon: CalendarDays },
    { to: '/student/profile', label: 'Profile', icon: User },
  ],
  faculty: [
    { to: '/faculty', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/faculty/start', label: 'Start Attendance', icon: Radio },
    { to: '/faculty/live', label: 'Live Attendance', icon: Users },
    { to: '/faculty/manual', label: 'Manual Attendance', icon: ListChecks },
    { to: '/faculty/concerns', label: 'Student Concerns', icon: MessageSquareWarning },
    { to: '/faculty/reports', label: 'Reports', icon: FileBarChart },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/students', label: 'Students', icon: GraduationCap },
    { to: '/admin/faculty', label: 'Faculty', icon: Users },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
    { to: '/admin/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/admin/timetable', label: 'Timetable', icon: Clock },
    { to: '/admin/attendance', label: 'Attendance Records', icon: ClipboardList },
    { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const items = NAV[user?.role] || [];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-100 h-screen sticky top-0">
      <div className="px-5 py-6">
        <Logo />
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            end={i.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-primary text-white shadow-soft' : 'text-slate-600 hover:bg-lightblue hover:text-primary'
              }`
            }
          >
            <i.icon size={18} />
            {i.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-100">
        <div className="px-3 py-2 mb-2">
          <div className="text-sm font-semibold text-navy truncate">{user?.name}</div>
          <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-danger transition">
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}