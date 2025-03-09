
import { sendEmail } from "../lib/emailSender.js";
import User from "../models/user.model.js"
import Assignment from "../models/assignment.model.js"


export const sendTestEmail = async(req,res)=>{
    try{
        const {email,subject,message} = req.body;
        await sendEmail(email, subject, message);
        res.status(200).json({ success: true, message: `Test email sent to ${email}` });

    }
    catch(e){
        console.log("error sending email")
        res.status(500).json({message : e.message})

    }
}
export const sendDueDateReminders = async(req,res)=>{
    try {
        const users = await User.find(); // Get all users

        for (const user of users) {
            const assignments = await Assignment.find({ studentEmail: user.email });

            for (const assignment of assignments) {
                if (!assignment.dueDate) continue; // Skip if no due date

                const dueDate = new Date(assignment.dueDate);
                const now = new Date();
                const timeRemaining = (dueDate - now) / (1000 * 60 * 60); // Convert to hours

                // Check if reminder should be sent
                if (user.reminderTimes.includes(Math.floor(timeRemaining)) &&
                    assignment.reminderCount < user.reminderFrequency) {

                    // Send email
                    await sendEmail(
                        user.email,
                        `Reminder: ${assignment.title} Due Soon!`,
                        `Your assignment "${assignment.title}" is due on ${assignment.dueDate}.`
                    );

                    // Update reminder count
                    assignment.reminderCount += 1;
                    await assignment.save();
                }
            }
        }
    } catch (error) {
        console.error("Error sending reminders:", error);
    }
};
