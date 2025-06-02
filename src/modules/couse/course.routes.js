import { Router } from 'express'
const router = Router()
import * as course from './course.controller.js'
import { isAuth } from '../../middelwares/auth.js'
import { checkAdmin } from '../../middelwares/adminAuth.js'


router.post('/',isAuth(),checkAdmin(),course.addCourse)
router.get('/',isAuth(),checkAdmin(),course.getCourses)






export default router