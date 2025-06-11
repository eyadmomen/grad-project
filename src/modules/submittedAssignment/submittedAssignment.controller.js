import { submittedAssignmentModel } from '../../../connections/models/submittedAssignment.model.js';
import { asyncHandler } from '../../utils/errorHandeling.js';
import { leasonModel } from '../../../connections/models/leason.model.js';
// Get all submissions for a lesson
export const getAllSubmissions = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;
  const submissions = await submittedAssignmentModel.find({ lessonId }).populate('userId', 'name email');
  res.status(200).json({ submissions });
});

// Get a submission by ID
export const getSubmissionById = asyncHandler(async (req, res, next) => {
  const { submissionId } = req.params;
  const submission = await submittedAssignmentModel.findById(submissionId).populate('userId', 'name email');
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }
  res.status(200).json({ submission });
});

// Get a submission by ID (for students to view their own submission)
export const getMySubmission = asyncHandler(async (req, res, next) => {
  const { submissionId } = req.params;
  const userId = req.authuser._id; // Get the authenticated user's ID

  const submission = await submittedAssignmentModel.findOne({ _id: submissionId, userId }).populate('userId', 'name email');
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found or unauthorized' });
  }

  res.status(200).json({ submission });
});

// Download a submission (for students to download their own submission)
export const downloadMySubmission = asyncHandler(async (req, res, next) => {
  const { submissionId } = req.params;
  const userId = req.authuser._id; // Get the authenticated user's ID

  const submission = await submittedAssignmentModel.findOne({ _id: submissionId, userId });
  if (!submission || !submission.file || !submission.file.filePath) {
    return res.status(404).json({ message: 'Submission not found or unauthorized' });
  }

  res.download(submission.file.filePath);
});

// Create a submission
// export const createSubmission = asyncHandler(async (req, res, next) => {
//   try {
//     const { lessonId } = req.params;
//     const userId = req.authuser._id; // Get userId from authenticated user

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized: User ID not found" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Save file locally
//     const filePath = req.file.path; // multer saves the file locally

//     const submission = await submittedAssignmentModel.create({
//       lessonId,
//       userId,
//       file: { filePath },
//       submittedAt: new Date()
//     });

//     res.status(201).json({ message: 'Submission created successfully', submission });
//   } catch (error) {
//     console.error('Error creating submission:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });
export const createSubmission = asyncHandler(async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const userId = req.authuser._id;
  
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found" });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      const filePath = req.file.path;
  
      const submission = await submittedAssignmentModel.create({
        lessonId,
        userId,
        file: { filePath },
        submittedAt: new Date()
      });
  
      // Add this block to update the lesson's submissions array
      await leasonModel.findByIdAndUpdate(
        lessonId,
        { $push: { submissions: submission._id } }
      );
  
      res.status(201).json({ message: 'Submission created successfully', submission });
    } catch (error) {
      console.error('Error creating submission:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });

// Update a submission
export const updateSubmission = asyncHandler(async (req, res, next) => {
  const { submissionId } = req.params;
  const { mark, feedback, status } = req.body;
  const submission = await submittedAssignmentModel.findById(submissionId);
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }
  if (mark) submission.mark = mark;
  if (feedback) submission.feedback = feedback;
  if (status) submission.status = status;
  await submission.save();
  res.status(200).json({ message: 'Submission updated successfully', submission });
});

// Delete a submission
export const deleteSubmission = asyncHandler(async (req, res, next) => {
  const { submissionId } = req.params;
  const submission = await submittedAssignmentModel.findByIdAndDelete(submissionId);
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }
  res.status(200).json({ message: 'Submission deleted successfully' });
});

// Review all submissions (admin only)
export const reviewAllSubmissions = asyncHandler(async (req, res, next) => {
  const { role } = req.authuser;

  if (role !== 'Admin') {
    return res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }

  const submissions = await submittedAssignmentModel.find()
    .populate({
      path: 'userId',
      select: 'username email'
    })
    .populate({
      path: 'lessonId',
      select: 'title description courseId',
      populate: {
        path: 'courseId',
        select: 'title   imageurl'
      }
    });

  res.status(200).json({ submissions });
});

// Grade a submission (admin only)
export const gradeSubmission = asyncHandler(async (req, res, next) => {
  const { submissionId } = req.params;
  const { rating, feedback } = req.body;
  const { role } = req.authuser;

  if (role !== 'Admin') {
    return res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 0 and 5' });
  }

  const submission = await submittedAssignmentModel.findById(submissionId);
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  submission.rating = rating;
  if (feedback) submission.feedback = feedback;
  submission.status = 'graded';
  await submission.save();

  // Get the updated submission with populated fields
  const updatedSubmission = await submittedAssignmentModel.findById(submissionId)
    .populate({
      path: 'userId',
      select: 'username email'
    })
    .populate({
      path: 'lessonId',
      select: 'title description courseId',
      populate: {
        path: 'courseId',
        select: 'title imageurl'
      }
    });

  res.status(200).json({ message: 'Submission graded successfully', submission: updatedSubmission });
}); 