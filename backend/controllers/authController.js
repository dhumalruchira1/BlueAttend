import User from '../models/User.js';
import { signToken } from '../utils/token.js';
import Department from '../models/Department.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, rollNumber, department, semester, division, employeeId } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    let deptId = department;
    if (department && !/^[a-f0-9]{24}$/i.test(department)) {
      const dept = await Department.findOne({ code: department.toUpperCase() });
      deptId = dept?._id;
    }

    const user = await User.create({
      name, email, password, role, rollNumber, employeeId,
      department: deptId, semester, division,
    });
    const token = signToken(user);
    res.status(201).json({ token, user: sanitize(user) });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });
    const token = signToken(user);
    res.json({ token, user: sanitize(user) });
  } catch (e) { next(e); }
};

export const me = async (req, res) => res.json({ user: req.user });

const sanitize = (u) => {
  const { password, ...rest } = u.toObject();
  return rest;
};