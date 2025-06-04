import { courseModel } from "../../../connections/models/course.model.js";
import { asyncHandler } from "../../utils/errorHandeling.js";
import cloudinary from '../../utils/cloudinaryConfigration.js'

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
  
    res.status(201).json({message:"added done", course,courseId: course._id});
  });

export const uploadCoursePic = asyncHandler(async (req, res, next) => {
  const { _id } = req.authuser;
  const { courseId } = req.body;

  if (!req.file) {
    return next(new Error("no file uploaded", { cause: 400 }));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `course/cover/${_id}`,
    use_filename: true,
    unique_filename: false,
    resource_type: 'auto'
  });

  const course = await courseModel.findByIdAndUpdate(courseId, {
    imageurl: { secure_url, public_id }
  }, { new: true });

  if (!course) {
    await cloudinary.uploader.destroy(public_id);
    return next(new Error("Course not found", { cause: 404 }));
  }

  res.status(200).json({ message: 'Image uploaded successfully', course });
});

// =============== show courses =================//

export const getCourses = asyncHandler(async (req, res) => {
    const courses = await courseModel.find({});
    res.json(courses);
});