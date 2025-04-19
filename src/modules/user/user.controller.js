import { userModel } from '../../../connections/models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { asyncHandler } from '../../utils/errorHandeling.js'

//========================= Sign Up ==================
export const SignUp = asyncHandler(async (req, res, next) => {
  // try {
  const { username, email, password,cPassword, gender } = req.body
  // email check
  const isUserExists = await userModel.findOne({ email })
  if (isUserExists) {
    return res.status(400).json({ message: 'Email is already exist' })
  }
  // hashing password
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
  const userInstance = new userModel({
    username,
    email,
    password: hashedPassword,
    gender,
  })
  await userInstance.save()
  res.status(201).json({ message: 'Done', userInstance })
  
}

)
//========================== Sign In ========================
export const SignIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  
  const isUserExists = await userModel.findOne({ email })
  if (!isUserExists) {
    return res.status(400).json({ message: 'Invalid login credentials' })
  }
  const passMatch = bcrypt.compareSync(password, isUserExists.password) // return boolean
  if (!passMatch) {
    return res.status(400).json({ message: 'Invalid login credentials' })
  }

  const userToken = jwt.sign({email, _id:isUserExists._id},'testToken')
  res.status(200).json({ message: 'loggedIn success', userToken})
 
})

//========================== Update profile =================
export const updateProfile = asyncHandler(async (req, res, next) => {

  const {_id}=req.authuser
  const { email , username } = req.body
  const { loggedInId } = req.query




  const userExist = await userModel.findOne({ email })

  // console.log({
  //   userId: userExist._id.toString(),
  //   loggedInId,
//   // })

//   console.log(_id)
// console.log(  userExist._id.toString());
  if(!userExist){
    return res.status(400).json({ message: 'email is not exist' })
  }
  
  if (userExist._id.toString() !== _id.toString()) {
    return res.status(401).json({ message: 'Unauthorized to take this action' })
  }
  const user = await userModel.updateOne({ email }, { username })
  if (user.modifiedCount) {
    return res.status(200).json({ message: ' updated Done' , user})
  }
  res.status(400).json({ message: 'Update fail' })
 
})

//========================== get user =======================

export const getUserProfile = asyncHandler(async (req, res) => {
 
  const { _id } = req.authuser
  const user = await userModel.findById(_id)
  if (user) {
    return res.status(200).json({ message: 'Done', user })
  }
  return res.status(404).json({ message: 'invalid id' })
 
})
