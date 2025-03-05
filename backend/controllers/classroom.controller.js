
import axios from "axios"

export const getCourseList = async(req,res)=>{
    try{
        const accessToken = req.cookies.accessToken;

        // await axios.get("https://www.googleapis.com/oauth2/v1/tokeninfo", {
        //     params: { access_token: accessToken },
        // })
        
        if (!accessToken) {
            return res.status(401).json({ message: "Access token missing" });
        }

        const response = await axios.get(
            "https://classroom.googleapis.com/v1/courses",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        res.json(response.data);

    }
    catch(e){
        console.log("error in getCourseList");
        res.status(500).json({error:e.message});
    }
}