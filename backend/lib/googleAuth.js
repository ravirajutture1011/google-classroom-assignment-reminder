import dotenv from "dotenv";

dotenv.config();

export const googleAuthConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectURI: "http://localhost:5000/api/auth/google/callback",
  scope: [
    "profile",
    "email",
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.me.readonly"
  ],
};
