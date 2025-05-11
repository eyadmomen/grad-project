
import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'
const { boolean } = Joi;


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

    profile_pic: {secure_url:String,public_id:String},
    cover_pic:[{secure_url:String,public_id:String}],
    score: {
      type: Number,
      default: undefined,
    },
    schedule_time: {
      type: String,
      enum: ['Sunday 3 pm', 'Tuesday 3 pm', 'Friday 3 pm'],
      default: null
    },

  },
  {
    timestamps: true,
  },
)

export const userModel = mongoose.model('User', userSchema)

