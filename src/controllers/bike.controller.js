import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { Bike } from "../models/bike.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

export const addBike = asyncHandler(async (req, res) => {
  const {
    bikeCompanyName,
    bikeModelName,
    bikeName,
    bikeType,
    bikeModelYear,
    kilometerDriven,
    fuelCapacity,
    bikeAverage,
    bikePrice,
  } = req.body;

  // Convert fields to numbers
  const bikeModelYearNum = Number(bikeModelYear);
  const kilometerDrivenNum = Number(kilometerDriven);
  const fuelCapacityNum = Number(fuelCapacity);
  const bikeAverageNum = Number(bikeAverage);
  const bikePriceNum = Number(bikePrice);

  if (!bikeCompanyName || typeof bikeCompanyName !== "string") {
    throw new ApiError(400, "Bike company name is required and must be a string");
  }

  if (!bikeName || typeof bikeName !== "string") {
    throw new ApiError(400, "Bike name is required and must be a string");
  }

  // Bike Model Name is optional so no validation 

  let bikeTypes = ["automatic", "manual"];
  if (!bikeType || !bikeTypes.includes(bikeType)) {
    throw new ApiError(400, `Bike type is required and must be one of the following: ${bikeTypes.join(", ")}`);
  }

  let currentYear = new Date().getFullYear();
  
  if (!bikeModelYearNum || isNaN(bikeModelYearNum) || bikeModelYearNum > currentYear || bikeModelYearNum < 2000) {
    throw new ApiError(400, "Bike model year is required and must be a valid year up to the current year.");
  }
  
  if (!kilometerDrivenNum || isNaN(kilometerDrivenNum) || kilometerDrivenNum <= 0) {
    throw new ApiError(400, "Kilometer driven is required and must be a positive number.");
  }
  
  if (!fuelCapacityNum || isNaN(fuelCapacityNum) || fuelCapacityNum <= 0 || fuelCapacityNum > 30) {
    throw new ApiError(400, "Fuel capacity is required and must be between 1 and 30 liters.");
  }
  
  if (!bikeAverageNum || isNaN(bikeAverageNum) || bikeAverageNum <= 0 || bikeAverageNum > 100) {
    throw new ApiError(400, "Bike average is required and must be between 5 and 100 km/l.");
  }
  
  if (!bikePriceNum || isNaN(bikePriceNum) || bikePriceNum < 399 || bikePriceNum > 1499) {
    throw new ApiError(400, "Bike price is required and must be between 399 to 1499.");
  }
  
  const bikeImageFileLocalPath = req.file?.path;

  if (!bikeImageFileLocalPath) {
    throw new ApiError(400, "Bike Image is required");
  }

  const bikeImageFile = await uploadOnCloudinary(bikeImageFileLocalPath);

  if (!bikeImageFile) {
    throw new ApiError(500, "Something went wrong while uploading the bike image.");
  }

  const existingBike = await Bike.findOne({ bikeCompanyName , bikeName , bikeModelName , bikeModelYear: bikeModelYearNum });

  if (existingBike) {
    throw new ApiError(400, "Bike with the same name and model year already exists.");
  }

  const bike = await Bike.create({
    bikeCompanyName,
    bikeName,
    bikeModelName : bikeModelName || "",
    bikeImage: bikeImageFile?.url,
    bikeType,
    bikeModelYear: bikeModelYearNum,
    kilometerDriven: kilometerDrivenNum,
    fuelCapacity: fuelCapacityNum,
    bikeAverage: bikeAverageNum,
    bikePrice: bikePriceNum,
  });

  if (!bike) {
    throw new ApiError(500, "Something went wrong while adding the bike");
  }

  return res.status(201).json(new ApiResponse(200, bike, "Bike Added Successfully"));
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

export const updateBikeImage = asyncHandler(async (req , res) => {
  const {bikeId} = req.params;

  const bikeImageFileLocalPath = req.file?.path;

  if (!bikeImageFileLocalPath) {
    throw new ApiError(400, "Bike Image is required");
  }

  const bikeImageFile = await uploadOnCloudinary(bikeImageFileLocalPath);

  if (!bikeImageFile.url) {
    throw new ApiError(500, "Something went wrong while uploading the bike image.");
  }

  const bike = await Bike.findByIdAndUpdate(bikeId , {
    $set : {
      bikeImage : bikeImageFile.url
    },
  } , {new : true})

  return res.status(200).json(new ApiResponse(200 , bike , "Bike Image updated Successfully"))

})

export const searchBikes = asyncHandler(async (req , res) => {
  console.log("Arrived")

  const {companyName , type } = req.query;

  let filters = {isAvailable : true};

  if (companyName) {
    filters.bikeCompanyName = companyName
  }

  if (type) {
    filters.bikeType = type
  }

  const bikes = await Bike.find(filters);

  return res.status(200).json(new ApiResponse(200 , bikes , "Bikes retrieved successfully"));
})


