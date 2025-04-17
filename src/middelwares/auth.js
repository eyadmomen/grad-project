import jwt from 'jsonwebtoken'
import { userModel } from '../../connections/models/user.model.js'
export const isAuth= ()=>{

    return async (req , res , next )=>{
        const {token} = req.headers
        if(!token){
            return res.status(400).json({message:"please send token firt"})
        }
        const decodedData = jwt.verify(token,"testToken")
        if(!decodedData || decodedData.id){
            return res.status(400).json({message:"invalid token"})
        }
        const findUser = await userModel.findById(decodedData._id)
        if(!findUser){
            return res.status(400).json({message:"please signUP first"})
        }
        req.authuser = findUser
        next()
    }
}