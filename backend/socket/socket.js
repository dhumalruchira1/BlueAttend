import { Server } from 'socket.io';
import { verifyToken } from '../utils/token.js';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || '*', credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('No token'));
      const payload = verifyToken(token);
      socket.user = payload;
      next();
    } catch (err) {
      next(new Error('Unauthorised'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 socket connected: ${socket.user?.name}`);
    if (socket.user?.role === 'student') socket.join(`user:${socket.user.id}`);
    if (socket.user?.role === 'faculty') socket.join(`user:${socket.user.id}`);
    socket.on('join-session', (sessionId) => socket.join(`session:${sessionId}`));
    socket.on('leave-session', (sessionId) => socket.leave(`session:${sessionId}`));
    socket.on('disconnect', () => console.log('🔌 disconnected'));
  });

  return io;
};

export const getIO = () => io;
export const emitToSession = (sessionId, evt, data) => io?.to(`session:${sessionId}`).emit(evt, data);
export const emitToUser = (userId, evt, data) => io?.to(`user:${userId}`).emit(evt, data);