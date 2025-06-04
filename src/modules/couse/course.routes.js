import { Router } from 'express'
const router = Router()
import * as course from './course.controller.js'
import { isAuth } from '../../middelwares/auth.js'
import { checkAdmin } from '../../middelwares/adminAuth.js'
import { multercloudFunction } from '../../services/multerCloudenary.js'
import { allowedExtensions } from '../../utils/allowedExtentions.js'


router.post('/',isAuth(),checkAdmin(),course.addCourse)
router.get('/',course.getCourses)
router.post('/courseCover',isAuth(),multercloudFunction(allowedExtensions.Image).single('profile'),course.uploudProfilePic)

router.delete('/:courseId', isAuth(), course.deleteCourse);





export default router