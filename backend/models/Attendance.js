import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession' },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: String, required: true, index: true },
    status: { type: String, enum: ['present','absent','late'], default: 'present' },
    method: { type: String, enum: ['bluetooth','manual'], required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verification: {
      rssi: Number,
      deviceInfo: String,
      verifiedAt: Date,
    },
    note: String,
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

attendanceSchema.index(
  { student: 1, session: 1 },
  { unique: true, partialFilterExpression: { session: { $exists: true, $type: 'objectId' } } }
);
attendanceSchema.index({ student: 1, subject: 1, date: 1 });

export default mongoose.model('Attendance', attendanceSchema);