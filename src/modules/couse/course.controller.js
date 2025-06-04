import { courseModel } from "../../../connections/models/course.model.js";
import { asyncHandler } from "../../utils/errorHandeling.js";

// =============== add courses =================//

export const addCourse = asyncHandler (async(req,res,next)=>{
    const { title, description ,price} = req.body;

    if (!title || !description || !price) {
      res.status(400).json({message:"title and describtion and price is required "})
    }
  
    const course = await courseModel.create({
      title,
      description,
      price
    });
  
    res.status(201).json({message:"added done", course});
  });

export const uploudProfilePic = asyncHandler(async(req,res,next)=>{
  const {_id}=req.authuser
  const {courseId} = req.body
  if(!req.file){ 
    return next(new Error("no file uploaded",{cause:400}))
  }
  const {secure_url,public_id}  =await cloudinary.uploader.upload(req.file.path,{
    folder:`course/cover/${_id}`,
    // public_id:`${_id}`
    use_filename:true,
    unique_filename:false, 
    resource_type:'auto'
  })
  // if(!data){
  //   return next(new Error("no data",{cause:400}))
  // } 
  const user = await userModel.findByIdAndUpdate(courseId,{imageurl:{secure_url,public_id}},{new:true})
  if(!user){
    await cloudinary.uploader.destroy(public_id)//only one
    // await cloudinary.api.delete_all_resources([publicids])// delete bulk of publicids
  }
  res.status(200).json({message:'done',user})
})
// =============== show courses =================//

export const getCourses = asyncHandler(async (req, res) => {
    const courses = await courseModel.find({});
    res.json(courses);
});