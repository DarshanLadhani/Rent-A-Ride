import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { Bike } from "../models/bike.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";

export const addBike = asyncHandler(async (req, res) => {
  const {
    bikeName,
    bikeType,
    bikeModelYear,
    kilometerDriven,
    fuelCapacity,
    bikeAverage,
    bikePrice,
  } = req.body;

  if (!bikeName || typeof bikeName !== "string" || bikeName.split(" ").length > 3) {
    throw new ApiError(400 , "Bike name is required and must be at least 3 words long.")
  }

  let bikeTypes = ["automatic" , "manual"]
  if (!bikeType || !bikeTypes.includes(bikeType)) {
    throw new ApiError(400 , `Bike type is required and must be one of the following : ${bikeTypes.join(", ")}`)
  }

  let currentYear = new Date().getFullYear()

  if (!bikeModelYear || typeof bikeModelYear !== "number" || bikeModelYear > currentYear || bikeModelYear < 2000) {
    throw new ApiError(400 , "Bike model year is required and must be a valid year up to the current year.")
  }

  if (!kilometerDriven || typeof kilometerDriven !== "number" || kilometerDriven <= 0) {
    throw new ApiError(400 , "Kilometer driven is required and must be a positive number.")
  }

  if (!fuelCapacity || typeof fuelCapacity !== "number" || fuelCapacity <= 0 || fuelCapacity > 30) {
    throw new ApiError(400 , "Fuel capacity is required and must be between 1 and 30 liters.")
  }

  if (!bikeAverage || typeof bikeAverage !== "number" || bikeAverage <= 0 || bikeAverage > 100) {
    throw new ApiError(400 , "Bike average is required and must be between 5 and 100 km/l .")
  }

  if (!bikePrice || typeof bikeAverage !== "number" || bikePrice < 399 || bikePrice > 1499) {
    throw new ApiError(400 , "Bike price is required and must be at between 399 to 1499.")
  }

  const existingBike = await Bike.findOne({bikeName , bikeModelYear});

  if (existingBike) {
    throw new ApiError(400 , "Bike with the same name and model year already exists.")
  }

  const bike = await Bike.create({
    bikeName,
    bikeType,
    bikeModelYear,
    kilometerDriven,
    fuelCapacity,
    bikeAverage,
    bikePrice,
  })

  if (!bike) {
    throw new ApiError(500 , "Something went wrong while adding the bike");
  }

  return res.status(201).json(new ApiResponse(200 , bike , "Bike Added Successfully"))

});

export const getBikes = asyncHandler(async (req, res) => {
  const bikes = await Bike.find({});

  if (!bikes || bikes.length === 0) {
    throw new ApiError(404 , "No Bikes found in the system")
  }

  return res.status(200).json(new ApiResponse(200 , bikes , "Bikes retrived successfully"))
});


export const getBike = asyncHandler(async (req, res) => {
  
  const {bikeId} = req.params;

  const bike = await Bike.findById(bikeId);

  if (!bike) {
    throw new ApiError(404 , "Bike not found in the system")
  }

  return res.status(200).json(new ApiResponse(200 , bike , "Bike retrived successfully"))
});

export const removeBike = asyncHandler(async (req, res) => {
  const {bikeId} = req.params;

  const bike = await Bike.findByIdAndDelete(bikeId);

  if (bike === null) {
    throw new ApiError(404 , "Bike not found in the system")
  }

  return res.status(200).json(new ApiResponse(200 , bike , "Bike deleted successfully"))
});

export const updateBikeDetails = asyncHandler(async (req , res) => {
  const {bikeId} = req.params;

  const {
    kilometerDriven,
    fuelCapacity,
    bikeAverage,
    bikePrice,} = req.body;

    if (!kilometerDriven || typeof kilometerDriven !== "number" || kilometerDriven <= 0) {
      throw new ApiError(400 , "Kilometer driven is required and must be a positive number.")
    }
  
    if (!fuelCapacity || typeof fuelCapacity !== "number" || fuelCapacity <= 0 || fuelCapacity > 30) {
      throw new ApiError(400 , "Fuel capacity is required and must be between 1 and 30 liters.")
    }
  
    if (!bikeAverage || typeof bikeAverage !== "number" || bikeAverage <= 0 || bikeAverage > 100) {
      throw new ApiError(400 , "Bike average is required and must be between 5 and 100 km/l .")
    }
  
    if (!bikePrice || typeof bikeAverage !== "number" || bikePrice < 399 || bikePrice > 1499) {
      throw new ApiError(400 , "Bike price is required and must be at between 399 to 1499.")
    }

    const bike = await Bike.findById(bikeId);

    if (!bike) {
      throw new ApiError(404 , "Bike not found in the system")
    }
    
    const updatedBike = await Bike.findByIdAndUpdate(bikeId, {kilometerDriven , fuelCapacity , bikeAverage , bikePrice}, { new: true });

    if (!updatedBike) {
      throw new ApiError(500, "Failed to update bike.");
    }

    // Return the updated bike details
    return res.status(200).json(new ApiResponse(200, updatedBike, "Bike updated successfully"));

})



