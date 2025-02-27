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
    fuelType,
    bikeAverage,
    bikePrice,
  } = req.body;


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

  let fuelTypes = ["petrol" , "electric"];
  if (!fuelType || !fuelTypes.includes(fuelType)) {
    throw new ApiError(400, `Fuel type is required and must be one of the following: ${fuelTypes.join(", ")}`);
  }

    // Convert fields to numbers
    const bikeModelYearNum = Number(bikeModelYear);
    const kilometerDrivenNum = Number(kilometerDriven);
    let bikeAverageNum = null;
    let fuelCapacityNum = null;


    if (fuelType === "petrol") {
      fuelCapacityNum = Number(fuelCapacity);
      bikeAverageNum = Number(bikeAverage);
    } 

    console.log(fuelCapacityNum)
    console.log(bikeAverageNum)

    const bikePriceNum = Number(bikePrice);

  let currentYear = new Date().getFullYear();
  
  if (!bikeModelYearNum || isNaN(bikeModelYearNum) || bikeModelYearNum > currentYear || bikeModelYearNum < 2000) {
    throw new ApiError(400, "Bike model year is required and must be a valid year up to the current year.");
  }
  
  if (!kilometerDrivenNum || isNaN(kilometerDrivenNum) || kilometerDrivenNum <= 0) {
    throw new ApiError(400, "Kilometer driven is required and must be a positive number.");
  }
  
  if (fuelType === "petrol"){
    if (!fuelCapacityNum || isNaN(fuelCapacityNum) || fuelCapacityNum <= 0 || fuelCapacityNum > 30) {
      throw new ApiError(400, "Fuel capacity is required and must be between 1 and 30 liters.");
    }
  }

  if (fuelType === "petrol") {
    if (!bikeAverageNum || isNaN(bikeAverageNum) || bikeAverageNum < 5 || bikeAverageNum > 100) {
      throw new ApiError(400, "Bike average is required for petrol bikes and must be between 5 and 100 km/l.");
    }
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

  const existingBike = await Bike.findOne({ bikeCompanyName , bikeName , bikeModelName , bikeModelYear: bikeModelYearNum , fuelType});

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
    fuelType,
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

  const bike = await Bike.findById(bikeId);

  if (!bike) {
    throw new ApiError(404 , "Bike not found in the system")
  }

  const {
    kilometerDriven,
    fuelCapacity,
    bikeAverage,
    bikePrice,} = req.body;

    const kilometerDrivenNum = Number(kilometerDriven);
    const bikePriceNum = Number(bikePrice);
    let fuelCapacityNum = null;
    let bikeAverageNum = null;

    if (!kilometerDrivenNum || isNaN(kilometerDrivenNum) || kilometerDrivenNum <= 0) {
      throw new ApiError(400, "Kilometer driven is required and must be a positive number.");
    }
    
      if (!bikePriceNum || isNaN(bikePriceNum) || bikePriceNum < 399 || bikePriceNum > 1499) {
        throw new ApiError(400, "Bike price is required and must be between 399 to 1499.");
      }
    
      if (bike.fuelType === "petrol") {
        fuelCapacityNum = Number(fuelCapacity);
        bikeAverageNum = Number(bikeAverage);

        if (!fuelCapacityNum || isNaN(fuelCapacityNum) || fuelCapacityNum <= 0 || fuelCapacityNum > 30) {
          throw new ApiError(400, "Fuel capacity is required and must be between 1 and 30 liters.");
        }

        if (!bikeAverageNum || isNaN(bikeAverageNum) || bikeAverageNum < 5 || bikeAverageNum > 100) {
          throw new ApiError(400, "Bike average is required for petrol bikes and must be between 5 and 100 km/l.");
        }
      }
      
    const updatedBike = await Bike.findByIdAndUpdate(bikeId, {kilometerDriven : kilometerDrivenNum , fuelCapacity : fuelCapacityNum , bikeAverage : bikeAverageNum , bikePrice : bikePriceNum}, { new: true });

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
  
  const {companyNameQuery , bikeTypeQuery , fuelTypeQuery} = req.query;
  const { pickupDate, dropoffDate , pickupTime, dropoffTime } = req.body;

  if (!pickupDate || !dropoffDate || !pickupTime || !dropoffTime) {
    throw new ApiError(400, "Pickup and drop-off date/time are required");
  }

  const tempPickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
  const tempDropoffDateTime = new Date(`${dropoffDate}T${dropoffTime}`);
  const currentDateTime = new Date();
  const minHour = 9;
  const maxHour = 19;
  const pickupHour = tempPickupDateTime.getHours();
  const dropoffHour = tempDropoffDateTime.getHours();

  if (isNaN(tempPickupDateTime.getTime()) || isNaN(tempDropoffDateTime.getTime())) {
    throw new ApiError(400, "Invalid date or time format");
  }

  if (tempPickupDateTime.getTime() < currentDateTime.getTime()) {
    throw new ApiError(400 , "Pickup date and time must be in the future and between 9:00 AM and 7:00 PM")
  }

  if (tempDropoffDateTime.getTime() <= tempPickupDateTime.getTime()) {
    throw new ApiError(400 , "Drop-off date and time must be after pickup date and time")
  } 

  if (pickupHour < minHour || pickupHour >= maxHour) {
    throw new ApiError(400, "Pickup time must be between 9:00 AM and 7:00 PM");
  }

  if (dropoffHour < minHour || dropoffHour >= maxHour) {
    throw new ApiError(400, "Dropoff time must be between 9:00 AM and 7:00 PM");
  }

  const pickupDateTime = tempPickupDateTime.toLocaleString().split(",")
  const dropoffDateTime = tempDropoffDateTime.toLocaleString().split(",")

  let filters = {isAvailable : true};

  if (companyNameQuery) {
    filters.bikeCompanyName = companyNameQuery;
  }

  if (bikeTypeQuery) {
    filters.bikeType = bikeTypeQuery;
  }

  if (fuelTypeQuery) {
    filters.fuelType = fuelTypeQuery;
  }

  const bikes = await Bike.find(filters);

  return res.status(200).json(new ApiResponse(200 ,  {bikes , pickupDateTime , dropoffDateTime} , "Bikes retrieved successfully"));

})

export const bookFromSearchedBikes = asyncHandler (async (req , res) => {
  const {bikeId} = req.params;
  const { pickupDate, dropoffDate , pickupTime, dropoffTime } = req.body;

    if (!bikeId) {
      throw new ApiError(400 , "Bike Id is required")
    }

    if (!pickupDate || !dropoffDate || !pickupTime || !dropoffTime) {
      throw new ApiError(400, "Pickup and drop-off date/time are required");
    }
    
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const dropoffDateTime = new Date(`${dropoffDate}T${dropoffTime}`);
    
    const totalHours = Math.round((dropoffDateTime.getTime() - pickupDateTime.getTime()) / (1000 * 60 * 60 ));

    const totalDays = Math.floor(totalHours / 24);

    const remainingHours = (totalHours % 24);

    const bike = await Bike.findById(bikeId)

    if (!bike) {
      throw new ApiError(400 , "Something went wrong");
    }

    let totalAmount = totalDays * bike.bikePrice;

    if (remainingHours > 0) {
      totalAmount += (remainingHours / 24) * bike.bikePrice
    }

    const formatedPickupDateTime = pickupDateTime.toLocaleString().split(",");
    const formatedDropoffDateTime = dropoffDateTime.toLocaleString().split(",");

    return res.status(200).json(new ApiResponse(200 , {bike , selectedDateTime : {pickupDate : formatedPickupDateTime , dropoffDateTime : formatedDropoffDateTime  , totalAmount : Math.round(totalAmount) }} , "Bike Details"))
})



