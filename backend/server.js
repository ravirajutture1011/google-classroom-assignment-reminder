import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.route.js"
import classroomRoutes from "./routes/classroom.route.js"
import connectDB from './lib/db.js';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

 
app.use('/api/auth',authRoutes);
app.use('/api/classroom',classroomRoutes);

app.listen(5000, ()=>{
    console.log('Server is running on port 5000');
    connectDB();
    
})