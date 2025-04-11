import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { Booking } from "../models/booking.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { Bike } from "../models/bike.model.js";

export const bookSelectedBike = asyncHandler(async (req , res) => {
    const {bikeId} = req.params;
    const {pickupDateTime , dropoffDateTime , totalAmount} = req.body;
    const user = req.user;

    if (!user) {
        throw new ApiError(400 , "Please login")
    }

    if (!bikeId) {
        throw new ApiError(400 , "Bike Id is required")
    }
    
    if (!pickupDateTime || !dropoffDateTime || !totalAmount) {
        throw new ApiError(400 , "Pickup Date and Dropoff Date is required")
    }

    const bike = await Bike.findById(bikeId).select("bikeName bikeCompanyName bikeModelName");

    if (!bike) {
        throw new ApiError(400 , "Something went wrong while booking")
    }

    const isBookingExits = await Booking.findOne({userId : user._id , bikeId , bookingStatus : "pending"})

    if (isBookingExits) {
        throw new ApiError(400 , "Bike booking is already pending")
    }

    const booking = await Booking.create({
        userId : user._id,
        bookingStatus : "Pending",
        paymentStatus : "pending",
        store : "Astron Chowk , Rajkot",
        isCanceled : false,
        totalAmount,
        pickupDateTime,
        dropoffDateTime,
        bikeCompanyName : bike.bikeCompanyName,
        bikeName : bike.bikeName,
        bikeModelName : bike.bikeModelName,
    })

    if (!booking) {
        throw new ApiError(500 , "Something went wrong while booking the bike")
    }

    return res.status(200).json(new ApiResponse(200 , {booking , bike}))
})