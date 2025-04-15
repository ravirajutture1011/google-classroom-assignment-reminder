// utils/getAccessToken.js
import axios from 'axios';
import redis from './redis.js';

const getAccessToken = async (googleId) => {
  try {
    const cachedToken = await redis.get(`accessToken : ${googleId}`);
    if (cachedToken) return cachedToken;

    const storedRefreshToken = await redis.get(`refreshToken : ${googleId}`);
    if (!storedRefreshToken) throw new Error("Refresh token not found");

    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: storedRefreshToken,
      grant_type: "refresh_token",
    });

    const { access_token } = tokenResponse.data;
    if (access_token) {
      await redis.set(`accessToken : ${googleId}`, access_token, 'EX', 14 * 60); // expire in 14 mins
    }

    return access_token;
  } catch (err) {
    console.error("Failed to get access token:", err.message);
    return null;
  }
};

export default getAccessToken;
