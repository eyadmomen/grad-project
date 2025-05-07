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


// =============== show courses =================//



export const getCourses = asyncHandler(async (req, res) => {
    const courses = await courseModel.find({});
    res.json(courses);
  });