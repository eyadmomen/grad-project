import { Router } from 'express'
const router = Router()
import * as course from './course.controller.js'
import { isAuth } from '../../middelwares/auth.js'
import { checkAdmin } from '../../middelwares/adminAuth.js'


router.post('/',isAuth(),checkAdmin(),course.addCourse)
router.get('/',course.getCourses)
router.post('/courseCover',isAuth(),multercloudFunction(allowedExtensions.Image).single('profile'),course.uploudProfilePic)






export default router