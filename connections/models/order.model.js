import { Schema, model } from "mongoose";
const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courses: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "courses",
          required: true,
        },
        title: {
          type: String,
          //   required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
      },
      }    ],
    schedule: Schema.Types.ObjectId,
    total: {
      type: Number,
      default: 0,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "card"],
    },
  },
  { timestamps: true }
);

export const orderModel = model("Order", orderSchema);
