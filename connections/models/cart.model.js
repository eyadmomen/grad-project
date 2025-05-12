import mongoose, { Schema } from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    courses: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Courses",
          required: true,
        },
        scheduleId: {
          type: String,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const cartModel = mongoose.model("cart", cartSchema);
