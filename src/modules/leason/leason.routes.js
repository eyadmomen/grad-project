import { Router } from 'express';
import { 
  addleason, 
  getLessonsByCourse, 
  getLesson, 
  updateLesson, 
  deleteLesson,
  addvideotoleason,
  uploadAssig 
} from './leason.controller.js';
import { isAuth } from '../../middelwares/auth.js';
import { multercloudFunction } from '../../services/multerCloudenary.js';
import { allowedExtensions } from '../../utils/allowedExtentions.js';
import { checkAdmin } from '../../middelwares/adminAuth.js'

const router = Router();

// Lesson routes
router.post('/', isAuth(),checkAdmin(), addleason);
router.get('/course/:courseId', isAuth(), getLessonsByCourse);
router.get('/:lessonId', isAuth(), getLesson);
router.put('/:lessonId', isAuth(), updateLesson);
router.delete('/:lessonId', isAuth(), deleteLesson);
router.post('/uploadvideo/:_id',isAuth(),checkAdmin(),multercloudFunction(allowedExtensions.Videos).single('video'),addvideotoleason)//Admin only

// Video and assignment routes
router.post('/:lessonId/video', isAuth(), multercloudFunction(allowedExtensions.Videos).single('video'), addvideotoleason);
router.post('/:lessonId/assignment', isAuth(), multercloudFunction(allowedExtensions.Files).single('file'), uploadAssig);
router.post('/uploadAssig',isAuth(),multercloudFunction(allowedExtensions.Files).single('pdf'),uploadAssig)//User
router.get('/',isAuth(),getLesson)

export default router; 