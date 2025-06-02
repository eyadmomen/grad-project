import { Router } from 'express'

const router = Router()
import * as ls from './leason.controller.js'
import { isAuth } from '../../middelwares/auth.js'
import { multercloudFunction } from '../../services/multerCloudenary.js'
import { allowedExtensions } from '../../utils/allowedExtentions.js'
import { checkAdmin } from '../../middelwares/adminAuth.js'


router.post('/', isAuth(),checkAdmin(),ls.addleason)//Admin only
router.post('/uploadvideo/:_id',isAuth(),checkAdmin(),multercloudFunction(allowedExtensions.Videos).single('video'),ls.addvideotoleason)//Admin only

router.post('/uploadAssig',isAuth(),multercloudFunction(allowedExtensions.Files).single('pdf'),ls.uploadAssig)//User
router.get('/',isAuth(),ls.getLesson)


export default router