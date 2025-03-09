import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
 
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL ,
        pass: EMAIL_PASSWORD,
    },
});

export const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"Course Manager" <${EMAIL}>`,
            to,
            subject,
            text,
        });
        console.log(`📧 Email sent to ${to}: ${subject}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};
