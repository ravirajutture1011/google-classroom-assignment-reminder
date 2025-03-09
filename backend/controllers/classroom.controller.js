import axios from "axios";
import Course from "../models/cource.model.js"; 
import Assignment from "../models/assignment.model.js";


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


export const selectedCourses = async (req, res) => {
    try {
        const { googleId, selectedCourses } = req.body;

        if (!googleId || !selectedCourses || !Array.isArray(selectedCourses)) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        // Find existing user document
        let userCourses = await Course.findOne({ googleId });

        if (!userCourses) {
            // If no document exists, create a new one
            userCourses = new Course({
                googleId,
                courses: selectedCourses.map(course => ({
                    courseId: course.id,
                    courseName: course.name
                }))
            });

            await userCourses.save();
            return res.status(201).json({ message: "Courses saved successfully" });
        }

        // Extract existing course IDs
        const existingCourseIds = new Set(userCourses.courses.map(course => course.courseId));

        // Filter out courses that are not already saved
        const newCourses = selectedCourses.filter(course => !existingCourseIds.has(course.id));

        if (newCourses.length === 0) {
            return res.status(200).json({ message: "All courses are already saved" });
        }

        // Add new courses to the array
        userCourses.courses.push(...newCourses.map(course => ({
            courseId: course.id,
            courseName: course.name
        })));

        await userCourses.save();
        res.status(201).json({ message: "New courses saved successfully" });

    } catch (e) {
        console.error("Error in selectedCourses:", e.message);
        res.status(500).json({ error: e.message });
    }
};





export const getCourseAssignmentList = async (req, res) => {
    try {
        console.log("Request received in backend...");
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "Access token missing" });
        }

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Course ID is missing" });
        }
        const courseId = id;

        const response = await axios.get(
            `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const courseWork = response.data.courseWork || [];

        // ✅ If there are no assignments, return a success response with an empty list
        if (courseWork.length === 0) {
            return res.status(200).json({ assignments: [], message: "No assignments found for this course." });
        }

        const result = courseWork.map((courseWork) => ({
            title: courseWork.title,
            assignmentId : courseWork.id,
            description: courseWork.description || "No description available",
            dueDate: courseWork.dueDate || "No due date",
            updateTime : courseWork.updateTime.substring(0,10) || "",
            dueTime : courseWork.dueTime || "",
        }));
        console.log(response.data.courseWork)

        res.status(200).json({ assignments: result });
    } catch (e) {
        console.log("Error in getCourseAssignmentList:", e.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getAllAssignments = async(req,res)=>{
    try{
        const {id} = req.params;
        const googleId = id;
        const courses = await Course.findOne({googleId:id});
        console.log("courses: ", courses.courses);
        //got courses array containing bojects
        //iterate and get only ids of courses 
        const courseArray = [];
        for(let c of courses.courses){
            console.log(c.courseId);
            courseArray.push(c.courseId);
        }
        const accessToken = req.cookies.accessToken;
        console.log("accessToken: ", accessToken);
        if (!accessToken) {
            return res.status(401).json({ message: "Access token missing" });
        }
        
            //make api call for each couse assignment
            let i=0;
            for(let course of courseArray){
                 const courseId = course;
                 const response = await axios.get(
                    `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                const courseWork = response.data.courseWork || [];
                for(let c of courseWork){
                    await Assignment.findOneAndUpdate(
                        {
                            assignmentId:c.id,
                            googleId:googleId,
                            courseId:c.courseId,
                        },
                        {
                            googleId: googleId,
                            assignmentId: c.id,
                            courseId: courseId,
                            title: c.title,
                            description: c.description || "No description available",
                            dueDate: c.dueDate ? new Date(`${c.dueDate.year}-${c.dueDate.month}-${c.dueDate.day}`) : null,
                            updateTime: c.updateTime.substring(0, 10) || "",
                            dueTime: c.dueTime || "",
                        },
                        { upsert: true } // Insert if not found, update if found
                    )                   
                }
                
            }
            
            
            res.status(200).json({ message: "Assignments synced successfully." });
    }
    catch (e) {
        console.log("Error in getAllAssignments",e.message);
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

export const getStudentCources = async (req,res)=>{
    try{
        const {id} = req.params;
        const googleId = id ;
        const cources = await Course.find({googleId : googleId});
        res.json({ data: cources });
    }
    catch(e){
        console.log("error in getStudentCources");
        res.status(500).json({error:e.message});
    }
}

 