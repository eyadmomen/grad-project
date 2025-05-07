import { Router } from 'express'
const router = Router()
import * as course from './course.controller.js'


router.post('/',course.addCourse)
router.get('/',course.getCourses)






export default router