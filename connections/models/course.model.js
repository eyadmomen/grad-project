import mongoose, { Schema } from 'mongoose'



const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price:{
    type:Number
  }
});
export const courseModel = mongoose.model('courses', courseSchema)