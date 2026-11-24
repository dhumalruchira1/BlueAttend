import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

export const listStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' })
      .populate('department', 'name code')
      .select('-password');
    res.json({ students });
  } catch (e) { next(e); }
};

export const createStudent = async (req, res, next) => {
  try {
    const student = await User.create({ ...req.body, role: 'student' });
    await AuditLog.create({ actor: req.user._id, action: 'CREATE_STUDENT', entity: 'User', entityId: student._id });
    res.status(201).json({ student });
  } catch (e) { next(e); }
};

export const updateUser = async (req, res, next) => {
  try {
    const { password, role, ...rest } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true });
    res.json({ user });
  } catch (e) { next(e); }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    res.json({ user });
  } catch (e) { next(e); }
};

export const listFaculty = async (req, res, next) => {
  try {
    const faculty = await User.find({ role: 'faculty' }).populate('department', 'name code').select('-password');
    res.json({ faculty });
  } catch (e) { next(e); }
};

export const createFaculty = async (req, res, next) => {
  try {
    const faculty = await User.create({ ...req.body, role: 'faculty' });
    res.status(201).json({ faculty });
  } catch (e) { next(e); }
};