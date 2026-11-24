import Department from '../models/Department.js';
import Subject from '../models/Subject.js';
import Timetable from '../models/Timetable.js';
import Attendance from '../models/Attendance.js';

export const createDepartment = async (req, res, next) => {
  try { res.status(201).json({ department: await Department.create(req.body) }); }
  catch (e) { next(e); }
};
export const listDepartments = async (req, res, next) => {
  try { res.json({ departments: await Department.find() }); }
  catch (e) { next(e); }
};
export const createSubject = async (req, res, next) => {
  try { res.status(201).json({ subject: await Subject.create(req.body) }); }
  catch (e) { next(e); }
};
export const listSubjects = async (req, res, next) => {
  try {
    res.json({ subjects: await Subject.find()
      .populate('department', 'name code')
      .populate('faculty', 'name') });
  } catch (e) { next(e); }
};
export const upsertTimetable = async (req, res, next) => {
  try {
    const { department, semester, division } = req.body;
    const tt = await Timetable.findOneAndUpdate(
      { department, semester, division },
      req.body,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ timetable: tt });
  } catch (e) { next(e); }
};
export const getTimetable = async (req, res, next) => {
  try {
    const { department, semester, division } = req.query;
    const tt = await Timetable.findOne({ department, semester, division })
      .populate('slots.subject', 'name code')
      .populate('slots.faculty', 'name');
    res.json({ timetable: tt });
  } catch (e) { next(e); }
};
export const allAttendance = async (req, res, next) => {
  try {
    const { department, subject, date, student } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (date) filter.date = date;
    if (student) filter.student = student;
    const records = await Attendance.find(filter)
      .populate('student', 'name rollNumber')
      .populate('subject', 'name code')
      .populate('faculty', 'name');
    res.json({ records });
  } catch (e) { next(e); }
};