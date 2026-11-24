import AttendanceConcern from '../models/AttendanceConcern.js';
import Attendance from '../models/Attendance.js';
import Subject from '../models/Subject.js';
import AuditLog from '../models/AuditLog.js';
import Notification from '../models/Notification.js';
import { emitToUser } from '../socket/socket.js';

export const createConcern = async (req, res, next) => {
  try {
    const { subjectId, attendanceDate, sessionId, reason } = req.body;
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const concern = await AttendanceConcern.create({
      student: req.user._id,
      subject: subjectId,
      faculty: subject.faculty,
      attendanceDate,
      session: sessionId || undefined,
      reason,
    });

    await Notification.create({
      user: subject.faculty,
      title: 'New Attendance Concern',
      message: `${req.user.name} raised a concern for ${subject.name} on ${attendanceDate}.`,
      type: 'info',
      link: '/faculty/concerns',
    });
    emitToUser(subject.faculty, 'concern:new', { concern });

    res.status(201).json({ concern });
  } catch (e) { next(e); }
};

export const myConcerns = async (req, res, next) => {
  try {
    const concerns = await AttendanceConcern.find({ student: req.user._id })
      .populate('subject', 'name code')
      .populate('faculty', 'name')
      .sort({ createdAt: -1 });
    res.json({ concerns });
  } catch (e) { next(e); }
};

export const facultyConcerns = async (req, res, next) => {
  try {
    const concerns = await AttendanceConcern.find({ faculty: req.user._id })
      .populate('student', 'name rollNumber email')
      .populate('subject', 'name code')
      .sort({ createdAt: -1 });
    res.json({ concerns });
  } catch (e) { next(e); }
};

export const resolveConcern = async (req, res, next) => {
  try {
    const { action, remarks } = req.body; // action: 'approve' | 'reject'
    const concern = await AttendanceConcern.findById(req.params.id);
    if (!concern) return res.status(404).json({ message: 'Concern not found' });
    if (String(concern.faculty) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    if (concern.status !== 'pending') return res.status(400).json({ message: 'Already resolved' });

    concern.status = action === 'approve' ? 'approved' : 'rejected';
    concern.facultyRemarks = remarks;
    concern.resolvedAt = new Date();
    await concern.save();

    const att = await Attendance.findOne({ student: concern.student, subject: concern.subject, date: concern.attendanceDate });
    const newStatus = action === 'approve' ? 'present' : 'absent';
    if (att) {
      att.status = newStatus;
      att.updatedAt = new Date();
      att.note = `Concern ${concern.status}: ${remarks || ''}`;
      await att.save();
    } else {
      await Attendance.create({
        student: concern.student,
        subject: concern.subject,
        faculty: concern.faculty,
        date: concern.attendanceDate,
        status: newStatus,
        method: 'manual',
        markedBy: req.user._id,
        note: `Concern ${concern.status}`,
      });
    }

    await AuditLog.create({
      actor: req.user._id,
      action: `CONCERN_${concern.status.toUpperCase()}`,
      entity: 'AttendanceConcern',
      entityId: concern._id,
      meta: { remarks },
    });

    await Notification.create({
      user: concern.student,
      title: `Concern ${concern.status}`,
      message: `Your concern for ${concern.attendanceDate} was ${concern.status}.`,
      type: action === 'approve' ? 'success' : 'warning',
    });
    emitToUser(concern.student, 'concern:resolved', { concern });

    res.json({ concern });
  } catch (e) { next(e); }
};