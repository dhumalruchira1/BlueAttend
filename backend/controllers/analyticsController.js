import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import AttendanceSession from '../models/AttendanceSession.js';

export const studentStats = async (req, res, next) => {
  try {
    const records = await Attendance.find({ student: req.user._id });
    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const percent = total ? Math.round((present / total) * 100) : 0;
    res.json({ total, present, absent, percent });
  } catch (e) { next(e); }
};

export const adminOverview = async (req, res, next) => {
  try {
    const [students, faculty, departments, sessions] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'faculty', isActive: true }),
      Department.countDocuments(),
      AttendanceSession.countDocuments(),
    ]);
    const deptStats = await Department.aggregate([
      { $lookup: { from: 'users', localField: '_id', foreignField: 'department', as: 'users' } },
      { $project: { name: 1, code: 1, count: { $size: '$users' } } },
    ]);
    const attendance = await Attendance.aggregate([
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
      }},
    ]);
    res.json({ students, faculty, departments, sessions, deptStats, attendance });
  } catch (e) { next(e); }
};

export const facultyStats = async (req, res, next) => {
  try {
    const sessions = await AttendanceSession.find({ faculty: req.user._id });
    const sessionIds = sessions.map((s) => s._id);
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const present = await Attendance.countDocuments({ session: { $in: sessionIds }, status: 'present' });
    const absent = await Attendance.countDocuments({ session: { $in: sessionIds }, status: 'absent' });
    res.json({ totalStudents, classesTaken: sessions.length, present, absent });
  } catch (e) { next(e); }
};