import axios from "axios";
import Course from "../models/cource.model.js"; 


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

        const courses = response.data.courses.map((course)=>({
            id: course.id,
            name: course.name,
        }));
        res.json({
            data : courses,
        });

    }
    catch(e){
        console.log("error in getCourseList");
        res.status(500).json({error:e.message});
    }
}

// handle selected courses by user here and save in cource model
export const selectedCourses = async (req, res) => {
    try {
        console.log("Printing incoming data: Selected Courses ", req.body);
        const { googleId, selectedCourses } = req.body;

        if (!googleId || !selectedCourses || !Array.isArray(selectedCourses)) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        // Extract course IDs from the request
        const selectedCourseIds = selectedCourses.map(course => course.id);

        // Find existing courses for this user
        const existingCourses = await Course.find({ 
            googleId, 
            courseId: { $in: selectedCourseIds } 
        });

        // Get the IDs of already saved courses
        const existingCourseIds = new Set(existingCourses.map(course => course.courseId));

        // Filter out courses that are not already saved
        const newCourses = selectedCourses.filter(course => !existingCourseIds.has(course.id));

        if (newCourses.length === 0) {
            return res.status(200).json({ message: "All courses are already saved" });
        }

        // Insert only new courses into the database
        await Course.insertMany(newCourses.map(course => ({
            googleId,
            courseId: course.id,
            courseName: course.name,
        })));

        res.status(201).json({ message: "New courses saved successfully" });

    } catch (e) {
        console.log("Error in selectedCourses:", e.message);
        res.status(500).json({ error: e.message });
    }
};




export const getCourseAssignmentList = async(req,res)=>{
    // res.send("welcome");
    try{
        const accessToken = req.cookies.accessToken;
        console.log("accessToken");
        
        if(!accessToken){
            return res.status(401).json({message: "Access token missing" });
        }
        // const {courseId} = req.params
        const courseId = 706578272524

        const response = await axios.get(
            `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const result = response.data.courseWork.map((courseWork) => {
            return{
                title : courseWork.title,
                description : courseWork.description,
                dueDate : courseWork.dueDate,
            }
        })
        res.status(200).json({ assignments: result });
    }

    catch(e){
        console.log("error in getCourseAssignmentList");
        res.status(500).json({error:e.message});
    }

}

export const getRecentAnnouncements = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Access token missing" });
        }

        // Step 1: Get all courses
        const coursesResponse = await axios.get(
            "https://classroom.googleapis.com/v1/courses",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // const courses = [756342542107,755271073984,751532899344,738459157566,738349145534,742470210990,]
        const courses = coursesResponse.data.courses || [];

        // Step 2: Fetch latest announcement for each course in parallel
        const announcementsPromises = courses.map(async (course) => {
            try {
                const announcementResponse = await axios.get(
                    `https://classroom.googleapis.com/v1/courses/${course.id}/announcements`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        params: { orderBy: "updateTime desc", pageSize: 5 },
                    }
                );

                const announcements = announcementResponse.data.announcements || [];
                
                if (announcements.length > 0) {
                    const announcement = announcements[0];
                    return {
                        courseId: course.id,
                        courseName: course.name,
                        message: announcement.text,
                        createdAt: new Date(announcement.creationTime).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                            timeZone: "Asia/Kolkata",
                        }),
                        updateTime: new Date(announcement.updateTime).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                            timeZone: "Asia/Kolkata",
                        }),
                    };
                } else {
                    return { courseId: course.id, courseName: course.name, message: "No announcements available" };
                }
            } catch (err) {
                console.error(`Error fetching announcements for course ${course.id}:`, err.message);
                return { courseId: course.id, courseName: course.name, message: "Error fetching announcements" };
            }
        });

        // Step 3: Wait for all API calls to complete
        const announcementsData = await Promise.all(announcementsPromises);

        res.status(200).json({ announcements: announcementsData });
    } catch (e) {
        console.error("Error in getTopAnnouncementsForAllCourses:", e);
        res.status(500).json({ error: e.message });
    }
};


 