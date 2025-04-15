import express from "express"
import {protectRoute} from "../middlewares/auth.middleware.js"
import {getCourseList,getCourseAssignmentList,getRecentAnnouncements,selectedCourses,getStudentCources,getAllAssignments,deleteCourse,testController} from "../controllers/classroom.controller.js"



const router = express.Router()

router.get('/course-list',protectRoute ,getCourseList);
router.get('/assignment-list/:id',protectRoute ,getCourseAssignmentList);
router.get('/announcements',protectRoute ,getRecentAnnouncements);
router.post('/selected-courses',protectRoute, selectedCourses);
router.get('/student-courses/:id',protectRoute ,getStudentCources);
router.get('/all-assignments/:id',protectRoute ,getAllAssignments);

router.delete('/delete-course/:id/:courseId',protectRoute ,deleteCourse);

router.get('/test/:id',testController)
 
export default router
 
