import mongoose, { Schema } from "mongoose";

const bikeSchema = new Schema(
  {
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
    isAvailable: {
      type: Boolean,
      default : true,
      required: true,
    },
    bikeType: {
      type: String,
      enum : ["automatic" , "manual"],
      required: true,
    },
    bikeModelYear: {
      type: Number,
      required: true,
      min : 2000,
      max : new Date().getFullYear(),
    },
    kilometerDriven: {
      type: Number,
      required: true,
      min : 1,
    },
    fuelCapacity: {
      type: Number,
      default : null,
    },
    fuelType : {
      type : String,
      enum : ["petrol" , "electric"],
      required : true,
    },
    bikeAverage: {
      type: Number,
      default: null,
    },
    bikePrice: {
      type: Number, // 24-Hour Price
      required: true,
      min : 399,
      max : 1499,
    },
  },
  { timestamps: true }
);

export const Bike = new mongoose.model("Bike", bikeSchema);
