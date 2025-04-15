import mongoose from "mongoose";
import Assignment from "./models/assignment.model.js"; // adjust path if needed

const run = async () => {
  try {
    await mongoose.connect("mongodb+srv://ravirajutture123:JJLkNDJaNLZXBNBg@test.icuou.mongodb.net/?retryWrites=true&w=majority&appName=test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Assignment.collection.createIndex(
      { assignmentId: 1, googleId: 1, courseId: 1 },
      { unique: true }
    );

    console.log("✅ Unique index created successfully.");
  } catch (error) {
    console.error("❌ Error creating index:", error.message);
  } finally {
    mongoose.disconnect();
  }
};

run();
