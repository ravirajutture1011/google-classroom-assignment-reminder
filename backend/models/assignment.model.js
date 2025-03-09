import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    googleId: { type: String, required: true }, // Identifies the user
    courseId: { type: String, required: true }, // Identifies the course
    assignmentId: { type: String, required:true},
    title: { type: String, required: true }, 
    description: { type: String, default: "" }, 
    assignmentId: { type: String, required: true, unique: true },
    dueDate: { type: Date, default: null }, // Can be null if no due date is given
    createdAt: { type: Date, default: Date.now } // Track when assignment was added
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;