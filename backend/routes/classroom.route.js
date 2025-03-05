import express from "express"
import {protectRoute} from "../middlewares/auth.middleware.js"
import {getCourseList} from "../controllers/classroom.controller.js"



const router = express.Router()

router.get('/course-list',protectRoute ,getCourseList);


 
export default router