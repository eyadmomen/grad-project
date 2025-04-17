import { Router } from 'express'
const router = Router()
import * as ur from './user.controller.js'
import { isAuth } from '../../middelwares/auth.js'
import {  validationCoreFunction } from '../../middelwares/validation.js'
import { SignInSchema, SignUpSchema } from './user.validationSchema.js'



router.post('/',validationCoreFunction(SignUpSchema),ur.SignUp)
router.post('/login',validationCoreFunction(SignInSchema), ur.SignIn)
router.patch('/', isAuth(),ur.updateProfile)   //update only one
router.get('/', isAuth(),ur.getUserProfile)
export default router
