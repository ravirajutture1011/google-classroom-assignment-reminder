import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },  
    courses: [{   
        courseId: { type: String, required: true }, 
        courseName: { type: String, required: true }
    }]
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

export default Course;
