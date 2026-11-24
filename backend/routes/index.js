import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as auth from '../controllers/authController.js';
import * as att from '../controllers/attendanceController.js';
import * as concern from '../controllers/concernController.js';
import * as analytics from '../controllers/analyticsController.js';
import * as users from '../controllers/userController.js';
import * as admin from '../controllers/adminController.js';
import * as notif from '../controllers/notificationController.js';

const r = Router();

// Auth
r.post('/auth/register', auth.register);
r.post('/auth/login', auth.login);
r.get('/auth/me', protect, auth.me);

// Attendance
r.post('/attendance/sessions', protect, authorize('faculty'), att.startSession);
r.patch('/attendance/sessions/:id/end', protect, authorize('faculty'), att.stopSession);
r.get('/attendance/sessions/active', protect, att.activeSessions);
r.get('/attendance/sessions/:sessionId/live', protect, att.liveSession);
r.post('/attendance/mark-bluetooth', protect, authorize('student'), att.markBluetooth);
r.post('/attendance/manual', protect, authorize('faculty'), att.manualMark);
r.get('/attendance/my-history', protect, authorize('student'), att.studentHistory);
r.get('/attendance/my-subject-wise', protect, authorize('student'), att.subjectWise);

// Concerns
r.post('/concerns', protect, authorize('student'), concern.createConcern);
r.get('/concerns/my', protect, authorize('student'), concern.myConcerns);
r.get('/concerns/faculty', protect, authorize('faculty'), concern.facultyConcerns);
r.patch('/concerns/:id/resolve', protect, authorize('faculty'), concern.resolveConcern);

// Analytics
r.get('/analytics/student', protect, authorize('student'), analytics.studentStats);
r.get('/analytics/faculty', protect, authorize('faculty'), analytics.facultyStats);
r.get('/analytics/admin', protect, authorize('admin'), analytics.adminOverview);

// Users
r.get('/users/students', protect, authorize('admin','faculty'), users.listStudents);
r.post('/users/students', protect, authorize('admin'), users.createStudent);
r.patch('/users/:id', protect, users.updateUser);
r.delete('/users/:id', protect, authorize('admin'), users.deactivateUser);
r.get('/users/faculty', protect, authorize('admin'), users.listFaculty);
r.post('/users/faculty', protect, authorize('admin'), users.createFaculty);

// Admin master data
r.post('/admin/departments', protect, authorize('admin'), admin.createDepartment);
r.get('/admin/departments', protect, admin.listDepartments);
r.post('/admin/subjects', protect, authorize('admin'), admin.createSubject);
r.get('/admin/subjects', protect, admin.listSubjects);
r.post('/admin/timetables', protect, authorize('admin'), admin.upsertTimetable);
r.get('/admin/timetables', protect, admin.getTimetable);
r.get('/admin/attendance', protect, authorize('admin'), admin.allAttendance);

// Notifications
r.get('/notifications', protect, notif.myNotifications);
r.patch('/notifications/read-all', protect, notif.markRead);

export default r;