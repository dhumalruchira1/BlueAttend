import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    semester: { type: Number, required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    credits: { type: Number, default: 4 },
  },
  { timestamps: true }
);

export default mongoose.model('Subject', subjectSchema);