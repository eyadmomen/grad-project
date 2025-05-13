import { Router } from 'express'

const router = Router()
import * as ls from './leason.controller.js'
import { isAuth } from '../../middelwares/auth.js'
import { multercloudFunction } from '../../services/multerCloudenary.js'
import { allowedExtensions } from '../../utils/allowedExtentions.js'


router.post('/', isAuth(),ls.addleason)
router.post('/uploadvideo/:_id',isAuth(),multercloudFunction(allowedExtensions.Videos).single('video'),ls.addvideotoleason)

router.post('/uploadAssig',isAuth(),multercloudFunction(allowedExtensions.Files).single('pdf'),ls.uploadAssig)
router.get('/',isAuth(),ls.getleason)


export default router