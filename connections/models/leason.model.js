import mongoose, { Schema } from 'mongoose';

const leasonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Courses',
      required: true
    },
    video: {
      secure_url: String,
      public_id: String
    },
    assignments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        file: {
          secure_url: String,
          public_id: String
        },
        mark:{
        type:String
        },
        submittedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const leasonModel = mongoose.model('Leason', leasonSchema);
