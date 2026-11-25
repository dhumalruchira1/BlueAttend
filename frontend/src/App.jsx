import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Protected from './components/Protected.jsx';

import StudentOverview from './pages/student/Overview.jsx';
import MarkAttendance from './pages/student/MarkAttendance.jsx';
import MyAttendance from './pages/student/MyAttendance.jsx';
import StudentConcerns from './pages/student/Concerns.jsx';
import Timetable from './pages/student/Timetable.jsx';
import Profile from './pages/student/Profile.jsx';

import FacultyOverview from './pages/faculty/Overview.jsx';
import StartAttendance from './pages/faculty/StartAttendance.jsx';
import LiveAttendance from './pages/faculty/LiveAttendance.jsx';
import ManualAttendance from './pages/faculty/ManualAttendance.jsx';
import FacultyConcerns from './pages/faculty/Concerns.jsx';
import FacultyReports from './pages/faculty/Reports.jsx';

import AdminOverview from './pages/admin/Overview.jsx';
import ManageStudents from './pages/admin/Students.jsx';
import ManageFaculty from './pages/admin/Faculty.jsx';
import ManageDepartments from './pages/admin/Departments.jsx';
import ManageSubjects from './pages/admin/Subjects.jsx';
import ManageTimetable from './pages/admin/Timetable.jsx';
import AttendanceRecords from './pages/admin/AttendanceRecords.jsx';
import AdminReports from './pages/admin/Reports.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/student" element={<Protected role="student"><DashboardLayout /></Protected>}>
        <Route index element={<StudentOverview />} />
        <Route path="mark" element={<MarkAttendance />} />
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="concerns" element={<StudentConcerns />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/faculty" element={<Protected role="faculty"><DashboardLayout /></Protected>}>
        <Route index element={<FacultyOverview />} />
        <Route path="start" element={<StartAttendance />} />
        <Route path="live" element={<LiveAttendance />} />
        <Route path="manual" element={<ManualAttendance />} />
        <Route path="concerns" element={<FacultyConcerns />} />
        <Route path="reports" element={<FacultyReports />} />
      </Route>

      <Route path="/admin" element={<Protected role="admin"><DashboardLayout /></Protected>}>
        <Route index element={<AdminOverview />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="faculty" element={<ManageFaculty />} />
        <Route path="departments" element={<ManageDepartments />} />
        <Route path="subjects" element={<ManageSubjects />} />
        <Route path="timetable" element={<ManageTimetable />} />
        <Route path="attendance" element={<AttendanceRecords />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}