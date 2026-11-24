import mongoose from 'mongoose';
import crypto from 'crypto';

const attendanceSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, unique: true, required: true, index: true },
    tokenHash: { type: String, required: true, select: false },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    semester: Number,
    division: String,
    room: String,
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: Date,
    endTime: Date,
    expiresAt: { type: Date, required: true, index: true },
    status: { type: String, enum: ['active','ended','expired'], default: 'active' },
    attendedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

attendanceSessionSchema.statics.generateSession = function () {
  const sessionId = 'BLU-' + crypto.randomBytes(4).toString('hex').toUpperCase();
  const rawToken = crypto.randomBytes(24).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { sessionId, rawToken, tokenHash };
};

export default mongoose.model('AttendanceSession', attendanceSessionSchema);