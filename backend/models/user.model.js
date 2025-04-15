import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//     name :{
//         type : String,
//         required : true,
//         minlength : 3
//     },
//     password :{
//         type : String, 
//         required : true,
//         minlength : 2
//     }
// })

// const User = mongoose.model('User', userSchema);
// export default User;

// import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true }, // Unique Google ID
    name: { type: String, required: true }, // User's name
    email: { type: String, required: true, unique: true }, // Email (Unique),
    accessToken: { type: String, required:true},

    reminderTimes: { type: [Number], default: [24, 12, 6] }, // Hours before due time
    reminderFrequency: { type: Number, default: 2 } // How many times to remind
    
  },
  { timestamps: true } // Auto add createdAt & updatedAt fields
);

export default mongoose.model("User", userSchema);
