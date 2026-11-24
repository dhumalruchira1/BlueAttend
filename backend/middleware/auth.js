import { verifyToken } from '../utils/token.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorised' });
    }
    const token = header.split(' ')[1];
    const payload = verifyToken(token);
    const user = await User.findById(payload.id).select('-password');
    if (!user || !user.isActive) return res.status(401).json({ message: 'User inactive' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};