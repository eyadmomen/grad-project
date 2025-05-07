import mongoose, { Schema } from 'mongoose';

const enrolledCoursesSchema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseid: [
      {
        type: Schema.Types.ObjectId,
        ref: 'courses',
      },
    ],
  },
  { timestamps: true }
);

export const enrolledCoursesModel = mongoose.model('EnrolledCourses', enrolledCoursesSchema);
