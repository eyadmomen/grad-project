import { Router } from 'express'
const router = Router()
import * as course from './course.controller.js'
import { isAuth } from '../../middelwares/auth.js'
import { checkAdmin } from '../../middelwares/adminAuth.js'
import { multercloudFunction } from '../../services/multerCloudenary.js'
import { allowedExtensions } from '../../utils/allowedExtentions.js'
import cloudinary from '../../utils/cloudinaryConfigration.js'


router.post('/',isAuth(),checkAdmin(),course.addCourse)
router.get('/',course.getCourses)
<<<<<<< HEAD
router.post('/courseCover',isAuth(),multercloudFunction(allowedExtensions.Image).single('profile'),course.uploudProfilePic)

router.delete('/:courseId', isAuth(), course.deleteCourse);

=======
// router.post('/courseCover',isAuth() , multercloudFunction(allowedExtensions.Image).single('courseimage'), course.uploadCoursePic);
>>>>>>> 1b4aeb88114514a88a7a7f2a62ed27ac78b406b6

router.post(
  '/courseCover',
  isAuth(),
  multercloudFunction(allowedExtensions.Image).single('courseimage'),
  course.uploadCoursePic
);



export default router