import { leasonModel } from "../../../connections/models/leason.model.js";
import { asyncHandler } from "../../utils/errorHandeling.js";

export const addleason = asyncHandler(async(req,res,next)=>{
    const {title,description,courseId}=req.body
    if (!title || !description ) {
        res.status(400).json({message:"title and describtion is required "})
      }
  const courseCheck = await courseModel.findById(courseId);
    if (!courseCheck) {
      return next(new Error('Invalid course ID', { cause: 400 }));
    }

 const leason = await leasonModel.create({
      title,
      description,
      courseId
    });

   
    res.status(201).json({message:"added done", leason});

})

export const addvideotoleason = asyncHandler(async(req,res,next)=>{
    const {_id}= req.params
    if(!req.file){ 
        return next(new Error("no video file uploaded",{cause:400}))
        }
           const {secure_url,public_id}  = await cloudinary.uploader.upload(req.file.path,{
                folder:`leason/video/${_id}`,
                // public_id:`${_id}`
                use_filename:true,
                unique_filename:false, 
                resource_type: 'video'
              })
               const videoleason = await leasonModel.findByIdAndUpdate(_id,{video:{ secure_url,public_id}},{new:true})
                    if(!videoleason){
                      await cloudinary.uploader.destroy(public_id)//only one
                      // await cloudinary.api.delete_all_resources([publicids])// delete bulk of publicids
                    }
                    res.status(200).json({message:'done',videoleason})
})
export const getleason = asyncHandler(async(req,res,next)=>{
    const {courseId}=req.body
    const courcesWithLeason = await leasonModel.findById(courseId)
    res.status(200).json({message:'done',courcesWithLeason})
})
export const uploadAssig = asyncHandler(async(req,res,next)=>{
    const {_id}=req.authuser
    if(!req.file){ 
      return next(new Error("no video file uploaded",{cause:400}))
      }
           const {secure_url,public_id}  = await cloudinary.uploader.upload(req.file.path,{
                    folder:`leason/pdf/${_id}`,
                    // public_id:`${_id}`
                    use_filename:true,
                    unique_filename:false, 
                    resource_type:'auto'
                  })
             const videoleason = await leasonModel.findByIdAndUpdate(_id,{userId:_id,video:{ secure_url,public_id}},{new:true})
                  if(!videoleason){
                    await cloudinary.uploader.destroy(public_id)//only one
                    // await cloudinary.api.delete_all_resources([publicids])// delete bulk of publicids
                  }
                  res.status(200).json({message:'done',videoleason})
})
