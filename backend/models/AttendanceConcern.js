import mongoose from 'mongoose';

const concernSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attendanceDate: { type: String, required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession' },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
    facultyRemarks: String,
    resolvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('AttendanceConcern', concernSchema);