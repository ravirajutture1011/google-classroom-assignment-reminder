import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.route.js"
import mailRoutes from "./routes/email.route.js"
import classroomRoutes from "./routes/classroom.route.js"
import connectDB from './lib/db.js';
import getAccessToken from './lib/getAccessToken.js';

// cron
import cron from "node-cron";
import { sendDueDateReminders } from "./controllers/mail.controller.js";
import { getAllAssignments } from './controllers/classroom.controller.js';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

 
app.use('/api/auth',authRoutes);
app.use('/api/classroom',classroomRoutes);
app.use('/api/mail',mailRoutes);



let cron_counter=0;
// inside cron.schedule
cron.schedule('*/1 * * * *', async () => {
    console.log('Running the sync job...');
    cron_counter++;
    console.log(`Cron job counter: ${cron_counter}`);
  
    try {
      const googleId = process.env.GOOGLE_ID;
      const accessToken = await getAccessToken(googleId);
  
      if (!accessToken) {
        console.error("Access token is null. Skipping job.");
        return;
      }
  
      const req = {
        params: { id: googleId },
        cookies: { accessToken }
      };
  
      const res = {
        status: (code) => ({
          json: (data) => {
            console.log(`Status: ${code}, Data:`, data);
          },
        }),
      };
  
      await getAllAssignments(req, res);

      //Call the sendDueDateReminders to send reminders
      await sendDueDateReminders(req, res);

    } catch (error) {
      console.error('Error in cron job:', error.message);
    }
  });







app.listen(5000, ()=>{
    console.log('Server is running on port 5000');
    connectDB();

    // Schedule the reminder job to run every hour (adjust as needed)
    cron.schedule('*/3 * * * *', async () => {
        console.log("Running assignment reminder job...");
        await sendDueDateReminders();
    });

    console.log("Cron job for reminders is scheduled.");
})