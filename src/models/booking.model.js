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
    calculatedPrice: {
      type: Number, // Represents a float value
      required: true,
    },
    deposit: {
      type: Number,
      required: true,
      default: 3000,
    },
    canceledAt: {
      type: Date,
    },
    pickupDate: {
      type: Date, // Date for pickup
      required: true,
    },
    dropoffDate: {
      type: Date, // Date for dropoff
      required: true,
    },
    pickupTime: {
      type: String, // Time stored as a string (e.g., "10:30 AM")
      required: true,
    },
    dropoffTime: {
      type: String, // Time stored as a string (e.g., "6:00 PM")
      required: true,
    },
  },
  { timestamps: true }
);

export const Booking = new mongoose.model("Booking", bookingSchema);
