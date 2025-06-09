import mongoose from 'mongoose';

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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    video: {
      secure_url: String,
      public_id: String,
      duration: Number,
      format: String
    },
    assignment: {
      secure_url: String,
      public_id: String,
      title: String,
      description: String,
      dueDate: Date
    },
    submissions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        file: {
          secure_url: String,
          public_id: String
        },
        mark: {
          type: Number,
          min: 0,
          max: 100
        },
        feedback: String,
        submittedAt: {
          type: Date,
          default: Date.now
        },
        status: {
          type: String,
          enum: ['pending', 'graded', 'returned'],
          default: 'pending'
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const leasonModel = mongoose.model('Leason', leasonSchema);
