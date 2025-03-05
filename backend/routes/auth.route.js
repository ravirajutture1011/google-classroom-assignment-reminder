import express from "express"
import { getGoogleAuthURL, googleCallback, login } from "../controllers/auth.controller.js";


const router = express.Router()

router.post('/login',login);


// this is for goole-classroom
router.get("/google",  getGoogleAuthURL);  // Step 1: Redirect user to Google  
router.get("/google/callback", googleCallback);  // Step 2: Get Authorization Code  


export default router
