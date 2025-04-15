import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  courseId: { type: String, required: true },
  assignmentId: { type: String, required: true }, // only one assignmentId field!
  title: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Compound index: one user can have same assignmentId as others
assignmentSchema.index({ assignmentId: 1, googleId: 1 }, { unique: true });

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
