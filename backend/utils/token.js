import jwt from 'jsonwebtoken';

export const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);