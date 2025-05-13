import { leasonModel } from "../../../connections/models/leason.model.js";
import { asyncHandler } from "../../utils/errorHandeling.js";
import { v2 as cloudinary } from 'cloudinary';
import { courseModel } from '../../../connections/models/course.model.js';

// Add a new lesson to a course
export const addleason = asyncHandler(async (req, res, next) => {
  const { title, description, courseId } = req.body;

  if (!title || !description || !courseId) {
    return res.status(400).json({ message: "title, description, and courseId are required" });
  }

  const courseCheck = await courseModel.findById(courseId);
  if (!courseCheck) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  const leason = await leasonModel.create({
    title,
    description,
    courseId
  });

  // Add the lesson to the course's lessons array
  courseCheck.lessons.push(leason._id);
  await courseCheck.save();

  res.status(201).json({ message: "Lesson added successfully", leason });
});

// Get all lessons for a specific course
export const getLessonsByCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const course = await courseModel.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const courselessons = await leasonModel.find({ courseId })
    .select('title description video assignments');

  res.status(200).json({ 
    message: 'Lessons retrieved successfully',
    courseName: course.title,
    courseId:course._id,
    courseImage:course.imageurl,
    courseDescription:course.description,
    courselessons 
  });
});

// Get a specific lesson
export const getLesson = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;

  const lesson = await leasonModel.findById(lessonId)
    .populate('courseId', 'title');

  if (!lesson) {
    return res.status(404).json({ message: 'Lesson not found' });
  }

  res.status(200).json({ 
    message: 'Lesson retrieved successfully',
    lesson 
  });
});

// Update a lesson
export const updateLesson = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;
  const { title, description } = req.body;

  const lesson = await leasonModel.findById(lessonId);
  if (!lesson) {
    return res.status(404).json({ message: 'Lesson not found' });
  }

  if (title) lesson.title = title;
  if (description) lesson.description = description;

  await lesson.save();

  res.status(200).json({ 
    message: 'Lesson updated successfully',
    lesson 
  });
});

// Delete a lesson
export const deleteLesson = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;

  const lesson = await leasonModel.findById(lessonId);
  if (!lesson) {
    return res.status(404).json({ message: 'Lesson not found' });
  }

  // Remove lesson from course's lessons array
  await courseModel.findByIdAndUpdate(
    lesson.courseId,
    { $pull: { lessons: lessonId } }
  );

  await leasonModel.findByIdAndDelete(lessonId);

  res.status(200).json({ message: 'Lesson deleted successfully' });
});

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
// تعديل على الكود
export const uploadAssig = asyncHandler(async (req, res, next) => {
  const userId = req.authuser._id;
  const { lessonId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: `leason/pdf/${userId}`,
      use_filename: true,
      unique_filename: false,
      resource_type: 'auto'
    });

    const updatedLesson = await leasonModel.findByIdAndUpdate(
      lessonId,
      {
        $push: {
          assignments: {
            userId,
            file: { secure_url, public_id },
            submittedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updatedLesson) {
      await cloudinary.uploader.destroy(public_id);
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({ 
      message: 'Assignment uploaded successfully',
      lesson: updatedLesson 
    });
  } catch (error) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.public_id);
    }
    return next(error);
  }
});

