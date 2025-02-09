import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    bikeId: {
      type: Schema.Types.ObjectId,
      ref: "Bike",
    },
    bookingStatus: {
      type: String,
      enum: ["confirm", "pending", "cancelled"],
      required: true,
    },
    store: {
      type: String,
      required: true,
    },
    isCanceled: {
      type: Boolean,
      required: true,
    },
    totalAmount : {
      type: Number, // Represents a float value
      required: true,
    },
    deposit: {
      type: Number,
      default: 3000,
    },
    canceledAt: {
      type: Date,
    },
    pickupDateTime: {
      type: Date, // Date and Time for pickup
      required: true,
    },
    dropoffDateTime: {
      type: Date, // Date and Time for dropoff
      required: true,
    },
  },
  { timestamps: true }
);

export const Booking = new mongoose.model("Booking", bookingSchema);
