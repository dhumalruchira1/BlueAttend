import AttendanceSession from '../models/AttendanceSession.js';
import Attendance from '../models/Attendance.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';
import { createSession, verifyAndMark, endSession } from '../services/attendanceService.js';
import { emitToUser } from '../socket/socket.js';

export const startSession = async (req, res, next) => {
  try {
    const { session, rawToken } = await createSession(req.user._id, req.body);
    res.status(201).json({ session, token: rawToken });
  } catch (e) { next(e); }
};

export const stopSession = async (req, res, next) => {
  try {
    const s = await endSession(req.params.id, req.user._id);
    res.json({ session: s });
  } catch (e) { next(e); }
};

export const markBluetooth = async (req, res, next) => {
  try {
    const record = await verifyAndMark(req.user._id, req.body);
    res.status(201).json({ attendance: record });
  } catch (e) { next(e); }
};

export const manualMark = async (req, res, next) => {
  try {
    const { studentId, subjectId, date, status, note } = req.body;
    if (!['present','absent','late'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const existing = await Attendance.findOne({ student: studentId, subject: subjectId, date });
    if (existing) {
      existing.status = status;
      existing.method = 'manual';
      existing.markedBy = req.user._id;
      existing.note = note;
      existing.updatedAt = new Date();
      await existing.save();
      emitToUser(studentId, 'attendance:updated', { record: existing });
      return res.json({ attendance: existing, updated: true });
    }
    const record = await Attendance.create({
      student: studentId, subject: subjectId, faculty: req.user._id,
      date, status, method: 'manual', markedBy: req.user._id, note,
    });
    emitToUser(studentId, 'attendance:updated', { record });
    res.status(201).json({ attendance: record, updated: false });
  } catch (e) { next(e); }
};

export const studentHistory = async (req, res, next) => {
  try {
    const records = await Attendance.find({ student: req.user._id })
      .populate('subject', 'name code')
      .sort({ date: -1 });
    res.json({ records });
  } catch (e) { next(e); }
};

export const subjectWise = async (req, res, next) => {
  try {
    const agg = await Attendance.aggregate([
      { $match: { student: req.user._id } },
      { $group: {
        _id: '$subject',
        total: { $sum: 1 },
        present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
      }},
      { $lookup: { from: 'subjects', localField: '_id', foreignField: '_id', as: 'subject' } },
      { $unwind: '$subject' },
    ]);
    res.json({ subjects: agg });
  } catch (e) { next(e); }
};

export const liveSession = async (req, res, next) => {
  try {
    const session = await AttendanceSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    const records = await Attendance.find({ session: session._id })
      .populate('student', 'name rollNumber');
    res.json({ session, records });
  } catch (e) { next(e); }
};

export const activeSessions = async (req, res, next) => {
  try {
    const filter = { status: 'active', expiresAt: { $gt: new Date() } };
    if (req.user.role === 'student') {
      filter.department = req.user.department;
      filter.semester = req.user.semester;
    } else if (req.user.role === 'faculty') {
      filter.faculty = req.user._id;
    }
    const sessions = await AttendanceSession.find(filter)
      .populate('subject', 'name code')
      .populate('faculty', 'name');
    res.json({ sessions });
  } catch (e) { next(e); }
};