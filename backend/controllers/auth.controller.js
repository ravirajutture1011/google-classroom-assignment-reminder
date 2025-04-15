import User from "../models/user.model.js";
import { googleAuthConfig } from "../lib/googleAuth.js";
import redis from  "../lib/redis.js" //import redis to save refresh token

import axios from "axios"

 

// function for storing refresh token in redis
const storeRefreshToken = async(googleId,refreshToken)=>{
    await redis.set(`refreshToken : ${googleId}` , refreshToken , "EX" , 7*24*60*60) // 7 days
}

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
      httpOnly: true, // prevent XSS attacks, cross site scripting attack
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
      maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // prevent XSS attacks, cross site scripting attack
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// this is for googl api
export const getGoogleAuthURL = (req, res) => {
  const authParams = new URLSearchParams({
    client_id: googleAuthConfig.clientID,
    redirect_uri: googleAuthConfig.redirectURI,
    response_type: "code",
    scope: googleAuthConfig.scope.join(" "), 
    access_type: "offline", //to get refresh token
    prompt: "consent",
  });
  const authURL = `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;
  res.redirect(authURL);
};

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query; // Step 2: Get Auth Code from Google
    if (!code) {
      return res.status(400).json({ error: "Authorization code not received" });
    }
    // console.log("Authorization code  : ", code);

    // res.json({ authorizationCode: code });  // Return the Auth Code (Next step: Exchange it for tokens)

    // Exchange code for access & refresh tokens
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      }
    );
    let { access_token, refresh_token, id_token } = tokenResponse.data;
    // console.log("access_token  : ", access_token);
    // console.log("refresh_token : ", refresh_token);



    //get user information 
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const userInfo = userInfoResponse.data;
    // console.log("User info : ", userInfo); // Display User Information
    const {id,email,name} = userInfo

    // store tokens in db or use them for further api calls
    const userExists = await User.findOne({email})
    
    if(userExists) {
      //update access token
      userExists.accessToken = access_token;
      await userExists.save();
    }
    else{
      //create new user
      const newUser = new User({
        googleId : id,
        name,
        email,
        accessToken: access_token,
      });

      await newUser.save();
    }


    //store refresh token in redis 
    // todo: handle edge cases 
    if(!access_token) {
      const redis_refresh_token = await redis.get(`refreshToken : ${id}`);
      if(redis_refresh_token) {
        const tokenResponse = await axios.post(
          "https://oauth2.googleapis.com/token",
          {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: redis_refresh_token,
            grant_type: "refresh_token",
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          }
        );
        access_token = tokenResponse.data.access_token;
        refresh_token = tokenResponse.data.refresh_token || redis_refresh_token;
      }
      else{
        return res.status(401).json({ message: "Refresh token not found" }); 
      }
    }

    if(refresh_token){
      await storeRefreshToken(id,refresh_token);
    }
  
    // Set cookies with access token
    setCookies(res, access_token, refresh_token);

    // res.json({
    //   message: "login success!!",
    // });
    res.redirect(`http://localhost:5173/dashboard?login=success`);

  } catch (error) {
    console.error("error in googleCallback",error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getUserInfo = async(req,res)=>{
  try{
    const { accessToken } = req.cookies;
    console.log("Printing access token in getuserinfo",accessToken);
    if(!accessToken){
      return res.status(401).json({ message: "Access token not found" });
    }
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    res.json(userInfoResponse.data);
  }
  catch(e){
    console.log("error in getUserInfo",e.message);
    res.status(500).json({error:e.message});
  }
};

export const logout = async (req,res)=>{
  try{
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "logout success" });
  }
  catch(e){
    console.log("error in logout",e.message);
    res.status(500).json({error:e.message});
  }
};

export const refreshAccessToken = async (req,res)=>{
  // const {googleId} = req.body;
  try{
  const googleId = "109540576940320069518"
  if(!googleId){
    return res.status(400).json({ error: "googleId not provided" });
  }
  const stored_refresh_token = await redis.get(`refreshToken : ${googleId}`)


  const tokenResponse = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token :stored_refresh_token,
      grant_type: "refresh_token",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    }
  );
  let { access_token, refresh_token, id_token } = tokenResponse.data; //google returns refresh token only once

  //store access token in cookie
  if (access_token) {
    res.cookie("accessToken", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
  }
  res.json({message: "Access token created successfully"});

  }
  catch(error){
    console.log("error in refreshAccessToken",error.message);
    res.status(500).json({ message: error.message });
  }
}
