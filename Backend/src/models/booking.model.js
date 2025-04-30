import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    bikeCompanyName: {
      type: String,
      required: true,
    },
    bikeName: {
      type: String,
      required: true,
    },
    bikeModelName: {
      type: String,
      default: "",
    },
    bikeImage: {
      type: String, // Cloudinary URL
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["Confirm", "Pending", "Cancelled"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["success", "pending", "failed"],
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
    totalDays : {
      type: Number, // Represents a float value
      required: true,
    },
    remainingHours : {
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
