import mongoose, { Schema } from 'mongoose';

const enrolledCoursesSchema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courses: [{
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
      },
      selectedSchedule: {
        type: Schema.Types.ObjectId,
        ref: 'Schedule',
        required: true
      }
    }]
  },
  { timestamps: true }
);

export const enrolledCoursesModel = mongoose.model('EnrolledCourses', enrolledCoursesSchema);
