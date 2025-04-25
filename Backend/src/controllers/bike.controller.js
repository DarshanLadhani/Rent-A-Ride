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
    topSpeed,
    chargingTime,
    kerbWeight,
    displacement,
  } = req.body;

  console.log("Body : " , req.body)


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
    const bikePriceNum = Number(bikePrice);
    const topSpeedNum = Number(topSpeed);
    const kerbWeightNum = Number(kerbWeight);

  
    let bikeAverageNum = null;
    let fuelCapacityNum = null;
    let displacementNum = null;
    let chargingTimeNum = null;


    if (fuelType === "petrol") {
      fuelCapacityNum = Number(fuelCapacity);
      bikeAverageNum = Number(bikeAverage);
      displacementNum = Number(displacement);
    } 

    if (fuelType === "electric") {
      chargingTimeNum = Number(chargingTime)
    }

  let currentYear = new Date().getFullYear();
  
  if (!bikeModelYearNum || isNaN(bikeModelYearNum) || bikeModelYearNum > currentYear || bikeModelYearNum < 2000) {
    throw new ApiError(400, "Bike model year is required and must be a valid year up to the current year.");
  }
  
  if (!kilometerDrivenNum || isNaN(kilometerDrivenNum) || kilometerDrivenNum <= 0) {
    throw new ApiError(400, "Kilometer driven is required and must be a positive number.");
  }
  
  if (!bikePriceNum || isNaN(bikePriceNum) || bikePriceNum < 399 || bikePriceNum > 1499) {
    throw new ApiError(400, "Bike price is required and must be between 399 to 1499.");
  }

  if (!topSpeedNum || isNaN(topSpeedNum) || topSpeedNum < 40 || topSpeedNum > 200) {
    throw new ApiError(400, "Top Speed is required and must be between 40 kmph to 200 kmph.");
  }

  if (!kerbWeightNum || isNaN(kerbWeightNum) || kerbWeightNum < 90 || kerbWeightNum > 200) {
    throw new ApiError(400, "Bike price is required and must be between 90 kg to 200 kg.");
  }

  if (fuelType === "petrol"){
    if (!fuelCapacityNum || isNaN(fuelCapacityNum) || fuelCapacityNum <= 0 || fuelCapacityNum > 30) {
      throw new ApiError(400, "Bike Fuel capacity is required and must be between 1 and 30 liters.");
    }
  }

  if (fuelType === "petrol") {
    if (!bikeAverageNum || isNaN(bikeAverageNum) || bikeAverageNum < 5 || bikeAverageNum > 120) {
      throw new ApiError(400, "Bike average is required for petrol bikes and must be between 5 and 120 km/l.");
    }
  } 

  if (fuelType === "petrol") {
    if (!displacementNum || isNaN(displacementNum) || bikeAverageNum < 40 || bikeAverageNum > 400) {
      throw new ApiError(400, "Bike Displacement is required for petrol bikes and must be between 40 cc and 400 cc");
    }
  } 

  if (fuelType === "electric") {
    if (!chargingTimeNum || isNaN(chargingTimeNum) || chargingTimeNum < 1 || chargingTimeNum > 12) {
      throw new ApiError(400, "Bike Charging Time is required for electric bikes and must be between 1 Hour and 12 Hours");
    }
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
    topSpeed : topSpeedNum,
    kerbWeight : kerbWeightNum,
    fuelCapacity: fuelCapacityNum,
    bikeAverage: bikeAverageNum,
    displacement : displacementNum,
    chargingTime : chargingTimeNum,
    bikePrice: bikePriceNum,
    fuelType,
  });

  if (!bike) {
    throw new ApiError(500, "Something went wrong while adding the bike");
  }

  return res.status(201).json(new ApiResponse(200, bike, "Bike Added Successfully"));
});

export const getBikes = asyncHandler(async (req, res) => {
  const {automatic , manual , petrol , electric , honda , tvs , ola , bajaj , ather , revolt} = req.query;

  let filters = { isAvailable: true };

  let bikeTypes = [];
  if (automatic === 'true') bikeTypes.push('automatic');
  if (manual === 'true') bikeTypes.push('manual');
  if (bikeTypes.length  > 0) {
    filters.bikeType = {$in : bikeTypes}
  }
  
  let fuelTypes = [];
  if (petrol === 'true') fuelTypes.push('petrol');
  if (electric === 'true') fuelTypes.push('electric');
  if (fuelTypes.length > 0) {
    filters.fuelType = { $in: fuelTypes };
  }
  
  let companies = [];
  if (honda === 'true') companies.push('Honda');
  if (tvs === 'true') companies.push('TVS');
  if (ola === 'true') companies.push('Ola');
  if (bajaj === 'true') companies.push('Bajaj');
  if (ather === 'true') companies.push('Ather');
  if (revolt === 'true') companies.push('Revolt');
  if (companies.length > 0) {
    filters.bikeCompanyName = { $in: companies };
  }

  const bikes = await Bike.find(filters);

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
    topSpeed,
    bikeAverage,
    bikePrice,
    chargingTime,} = req.body;

    const kilometerDrivenNum = Number(kilometerDriven);
    const bikePriceNum = Number(bikePrice);
    const topSpeedNum = Number(topSpeed);
    let bikeAverageNum = null;
    let chargingTimeNum = null;

    if (!kilometerDrivenNum || isNaN(kilometerDrivenNum) || kilometerDrivenNum <= 0) {
      throw new ApiError(400, "Kilometer driven is required and must be a positive number.");
    }
    
      if (!bikePriceNum || isNaN(bikePriceNum) || bikePriceNum < 399 || bikePriceNum > 1499) {
        throw new ApiError(400, "Bike price is required and must be between 399 to 1499.");
      }

      if (!topSpeedNum || isNaN(topSpeedNum) || topSpeedNum < 40 || topSpeedNum > 200) {
        throw new ApiError(400, "Top Speed is required and must be between 40 kmph to 200 kmph.");
      }
    
      if (bike.fuelType === "petrol") {
        bikeAverageNum = Number(bikeAverage);

        if (!bikeAverageNum || isNaN(bikeAverageNum) || bikeAverageNum < 5 || bikeAverageNum > 100) {
          throw new ApiError(400, "Bike average is required for petrol bikes and must be between 5 and 100 km/l.");
        }
      }

      if (bike.fuelType === "electric") {

        chargingTimeNum = Number(chargingTime);

        if (!chargingTimeNum || isNaN(chargingTimeNum) || chargingTimeNum < 1 || chargingTimeNum > 12) {
          throw new ApiError(400, "Bike Charging Time is required for electric bikes and must be between 1 Hour and 12 Hours");
        }
      }
      
    const updatedBike = await Bike.findByIdAndUpdate(bikeId, {kilometerDriven : kilometerDrivenNum  , bikeAverage : bikeAverageNum , bikePrice : bikePriceNum , chargingTime : chargingTimeNum}, { new: true });

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

  const {automatic , manual , petrol , electric , honda , tvs , ola , bajaj , ather , revolt} = req.query;
  const { pickupDate, dropoffDate } = req.body;

  console.log(req.query)

  if (!pickupDate || !dropoffDate ) {
    throw new ApiError(400, "Pickup and drop-off dates are required");
  }

  const tempPickupDateTime = new Date(`${pickupDate}`);
  const tempDropoffDateTime = new Date(`${dropoffDate}`);
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

  let filters = { isAvailable: true };

  let bikeTypes = [];
  if (automatic === 'true') bikeTypes.push('automatic');
  if (manual === 'true') bikeTypes.push('manual');
  if (bikeTypes.length  > 0) {
    filters.bikeType = {$in : bikeTypes}
  }
  
  let fuelTypes = [];
  if (petrol === 'true') fuelTypes.push('petrol');
  if (electric === 'true') fuelTypes.push('electric');
  if (fuelTypes.length > 0) {
    filters.fuelType = { $in: fuelTypes };
  }
  
  let companies = [];
  if (honda === 'true') companies.push('Honda');
  if (tvs === 'true') companies.push('TVS');
  if (ola === 'true') companies.push('Ola');
  if (bajaj === 'true') companies.push('Bajaj');
  if (ather === 'true') companies.push('Ather');
  if (revolt === 'true') companies.push('Revolt');
  if (companies.length > 0) {
    filters.bikeCompanyName = { $in: companies };
  }

  const bikes = await Bike.find(filters);

  return res.status(200).json(new ApiResponse(200 ,  {bikes , pickupDateTime , dropoffDateTime} , "Bikes retrieved successfully"));

})

export const bookFromSearchedBikes = asyncHandler (async (req , res) => {
  const {bikeId} = req.params;
  const { pickupDate, dropoffDate } = req.body;

    if (!bikeId) {
      throw new ApiError(400 , "Bike Id is required")
    }

    if (!pickupDate || !dropoffDate) {
      throw new ApiError(400, "Pickup and drop-off dates are required");
    }
    
    const pickupDateTime = new Date(`${pickupDate}`);
    const dropoffDateTime = new Date(`${dropoffDate}`);
    
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

    const formatedPickupDate = pickupDateTime.toLocaleDateString();
    const formatedDropoffDate = dropoffDateTime.toLocaleDateString();
    
    const formatedPickupTime = pickupDateTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    });
    
    const formatedDropoffTime = dropoffDateTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });


    return res.status(200).json(new ApiResponse(200 , {
      bike,
      selectedDateTime: {
        pickupDate: [`${formatedPickupDate}` , `${formatedPickupTime}`],
        dropoffDate: [`${formatedDropoffDate}` , `${formatedDropoffTime}`],
      },
      totalAmount: Math.round(totalAmount),
      totalDays,
      remainingHours,
    }, "Bike Details"));
    
})



