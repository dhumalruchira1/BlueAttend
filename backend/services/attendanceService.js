import crypto from 'crypto';
import AttendanceSession from '../models/AttendanceSession.js';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import Timetable from '../models/Timetable.js';
import Subject from '../models/Subject.js';
import AuditLog from '../models/AuditLog.js';
import { emitToSession } from '../socket/socket.js';

export const createSession = async (facultyId, payload) => {
  const { subjectId, departmentId, semester, division, room, durationMinutes = 5 } = payload;
  const subject = await Subject.findById(subjectId);
  if (!subject) throw Object.assign(new Error('Subject not found'), { status: 404 });

  const today = new Date().toISOString().slice(0, 10);
  const active = await AttendanceSession.findOne({
    subject: subjectId,
    date: today,
    status: 'active',
    faculty: facultyId,
  });
  if (active) throw Object.assign(new Error('An active session already exists for this subject'), { status: 409 });

  const { sessionId, rawToken, tokenHash } = AttendanceSession.generateSession();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

  const session = await AttendanceSession.create({
    sessionId,
    tokenHash,
    subject: subjectId,
    faculty: facultyId,
    department: departmentId,
    semester,
    division,
    room,
    date: today,
    startTime: now,
    expiresAt,
    status: 'active',
  });

  return { session, rawToken };
};

export const verifyAndMark = async (studentId, { sessionId, token, rssi, deviceInfo }) => {
  const session = await AttendanceSession.findOne({ sessionId }).select('+tokenHash');
  if (!session) throw Object.assign(new Error('Session not found'), { status: 404 });
  if (session.status !== 'active') throw Object.assign(new Error('Session is not active'), { status: 400 });
  if (new Date() > session.expiresAt) {
    session.status = 'expired';
    await session.save();
    throw Object.assign(new Error('Session expired'), { status: 400 });
  }

  const providedHash = crypto.createHash('sha256').update(token).digest('hex');
  if (providedHash !== session.tokenHash) {
    throw Object.assign(new Error('Invalid verification token'), { status: 403 });
  }

  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') throw Object.assign(new Error('Invalid student'), { status: 403 });
  if (String(student.department) !== String(session.department) || student.semester !== session.semester) {
    throw Object.assign(new Error('You are not enrolled in this class'), { status: 403 });
  }

  const today = new Date();
  const dayMap = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const timetable = await Timetable.findOne({
    department: session.department,
    semester: session.semester,
    division: session.division,
  });
  const nowHHMM = today.toTimeString().slice(0, 5);
  const match = timetable?.slots.find(
    (s) => s.day === dayMap[today.getDay()] &&
      String(s.subject) === String(session.subject) &&
      nowHHMM >= s.startTime && nowHHH <= s.endTime
  );
  if (!match) throw Object.assign(new Error('No matching scheduled class right now'), { status: 400 });

  const duplicate = await Attendance.findOne({ student: studentId, session: session._id });
  if (duplicate) throw Object.assign(new Error('Attendance already recorded for this session'), { status: 409 });

  const attendance = await Attendance.create({
    student: studentId,
    session: session._id,
    subject: session.subject,
    faculty: session.faculty,
    date: session.date,
    status: 'present',
    method: 'bluetooth',
    markedBy: studentId,
    verification: { rssi, deviceInfo, verifiedAt: new Date() },
  });

  session.attendedCount += 1;
  await session.save();

  await AuditLog.create({
    actor: studentId,
    action: 'MARK_ATTENDANCE',
    entity: 'Attendance',
    entityId: attendance._id,
    meta: { sessionId, rssi },
  });

  emitToSession(session.sessionId, 'attendance:new', {
    studentId, name: student.name, rollNumber: student.rollNumber, rssi,
    attendedCount: session.attendedCount,
  });

  return attendance;
};

export const endSession = async (sessionId, facultyId) => {
  const session = await AttendanceSession.findById(sessionId);
  if (!session) throw Object.assign(new Error('Session not found'), { status: 404 });
  if (String(session.faculty) !== String(facultyId)) throw Object.assign(new Error('Forbidden'), { status: 403 });
  session.status = 'ended';
  session.endTime = new Date();
  await session.save();
  emitToSession(session.sessionId, 'session:ended', { sessionId: session.sessionId });
  return session;
};