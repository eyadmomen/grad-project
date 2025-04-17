import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['female', 'male', 'not specified'],
      default: 'not specified',
    },
    profile_pic: String,
  },
  {
    timestamps: true,
  },
)

export const userModel = mongoose.model('User', userSchema)
