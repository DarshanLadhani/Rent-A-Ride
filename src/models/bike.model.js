import mongoose, { Schema } from "mongoose";

const bikeSchema = new Schema(
  {
    bikeName: {
      type: String,
      required: true,
      unique: true,
    },
    bikeImage: {
      type: String, // Cloudinary URL
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default : true,
      required: true,
    },
    bikeType: {
      type: String,
      required: true,
      trim: true,
    },
    bikeModelYear: {
      type: Number,
      required: true,
    },
    kilometerDriven: {
      type: Number,
      required: true,
    },
    fuelCapacity: {
      type: Number,
      required: true,
    },
    bikeAverage: {
      type: Number,
      required: true,
    },
    bikePrice: {
      type: Number, // 24-Hour Price
      required: true,
    },
  },
  { timestamps: true }
);

export const Bike = new mongoose.model("Bike", bikeSchema);
