import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Subject from '../models/Subject.js';
import Timetable from '../models/Timetable.js';
import Attendance from '../models/Attendance.js';
import AttendanceSession from '../models/AttendanceSession.js';
import AttendanceConcern from '../models/AttendanceConcern.js';
import Notification from '../models/Notification.js';

const seed = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany({}), Department.deleteMany({}), Subject.deleteMany({}),
    Timetable.deleteMany({}), Attendance.deleteMany({}), AttendanceSession.deleteMany({}),
    AttendanceConcern.deleteMany({}), Notification.deleteMany({}),
  ]);

  const cs = await Department.create({ name: 'Computer Science', code: 'CS', semesters: [1,2,3,4,5,6,7,8], divisions: ['A','B'] });
  const it = await Department.create({ name: 'Information Technology', code: 'IT', semesters: [1,2,3,4,5,6,7,8], divisions: ['A','B'] });

  const admin = await User.create({ name: 'Admin User', email: 'admin@blueattend.io', password: 'admin123', role: 'admin' });
  const fac1 = await User.create({ name: 'Dr. Priya Sharma', email: 'priya@blueattend.io', password: 'faculty123', role: 'faculty', employeeId: 'FAC001', department: cs._id });
  const fac2 = await User.create({ name: 'Prof. Rohan Mehta', email: 'rohan@blueattend.io', password: 'faculty123', role: 'faculty', employeeId: 'FAC002', department: cs._id });

  const s1 = await User.create({ name: 'Aarav Patel', email: 'aarav@blueattend.io', password: 'student123', role: 'student', rollNumber: 'CS21A001', department: cs._id, semester: 5, division: 'A' });
  const s2 = await User.create({ name: 'Isha Verma', email: 'isha@blueattend.io', password: 'student123', role: 'student', rollNumber: 'CS21A002', department: cs._id, semester: 5, division: 'A' });
  const s3 = await User.create({ name: 'Karan Singh', email: 'karan@blueattend.io', password: 'student123', role: 'student', rollNumber: 'CS21A003', department: cs._id, semester: 5, division: 'A' });

  const sub1 = await Subject.create({ name: 'Data Structures', code: 'CS301', department: cs._id, semester: 5, faculty: fac1._id });
  const sub2 = await Subject.create({ name: 'Operating Systems', code: 'CS302', department: cs._id, semester: 5, faculty: fac2._id });
  const sub3 = await Subject.create({ name: 'Database Systems', code: 'CS303', department: cs._id, semester: 5, faculty: fac1._id });

  await Timetable.create({
    department: cs._id, semester: 5, division: 'A',
    slots: [
      { day: 'Mon', startTime: '09:00', endTime: '10:00', subject: sub1._id, faculty: fac1._id, room: 'CS-101' },
      { day: 'Mon', startTime: '10:00', endTime: '11:00', subject: sub2._id, faculty: fac2._id, room: 'CS-102' },
      { day: 'Tue', startTime: '09:00', endTime: '10:00', subject: sub3._id, faculty: fac1._id, room: 'CS-103' },
      { day: 'Wed', startTime: '11:00', endTime: '12:00', subject: sub1._id, faculty: fac1._id, room: 'CS-101' },
      { day: 'Thu', startTime: '10:00', endTime: '11:00', subject: sub2._id, faculty: fac2._id, room: 'CS-102' },
      { day: 'Fri', startTime: '09:00', endTime: '10:00', subject: sub3._id, faculty: fac1._id, room: 'CS-103' },
    ],
  });

  // sample attendance
  const dates = ['2025-01-06','2025-01-07','2025-01-08','2025-01-09','2025-01-10'];
  for (const d of dates) {
    for (const stu of [s1, s2, s3]) {
      await Attendance.create({
        student: stu._id, subject: sub1._id, faculty: fac1._id, date: d,
        status: Math.random() > 0.2 ? 'present' : 'absent',
        method: 'manual', markedBy: fac1._id,
      });
    }
  }

  console.log('✅ Seeded. Login accounts:');
  console.log('  admin@blueattend.io / admin123');
  console.log('  priya@blueattend.io / faculty123');
  console.log('  aarav@blueattend.io / student123');
  await mongoose.disconnect();
};

seed().catch((e) => { console.error(e); process.exit(1); });