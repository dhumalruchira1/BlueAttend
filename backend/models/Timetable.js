import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    day: { type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat'], required: true },
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: String, required: true },
  },
  { _id: true }
);

const timetableSchema = new mongoose.Schema(
  {
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    semester: { type: Number, required: true },
    division: { type: String, required: true },
    slots: [slotSchema],
  },
  { timestamps: true }
);

timetableSchema.index({ department: 1, semester: 1, division: 1 }, { unique: true });

export default mongoose.model('Timetable', timetableSchema);