// course.model.js
import mongoose, { Schema } from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number
  },
  imageurl: {
    secure_url: String,
    public_id: String
  },
  schedules: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Schedule' // لازم يكون نفس الاسم المستخدم في model
    }
  ]
});

export const courseModel = mongoose.model('Courses', courseSchema); // ✅ تأكد الاسم هو "Course"
