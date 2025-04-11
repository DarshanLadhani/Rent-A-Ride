import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Complete", "Pending", "Failed"],
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
  },
  { timestamps: true }
);

export const Payment = new mongoose.model("Payment", paymentSchema);
