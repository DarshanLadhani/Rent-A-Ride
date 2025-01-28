import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';

export const verifyJwt = asyncHandler (async (req , res , next) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new ApiError(401 , "Unauthorized Request please login")
        }

        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            throw new ApiError(401 , "Invalid access token")
        }

        req.user = user;

        next()

    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid access token")
    }
})

export const restrictTo = asyncHandler (async (req , res  , next) => {
    try {
        
        if (!req.user) {
            throw new ApiError(400 , "Please Login")
        }

        if (req.user.role !== "admin") {
            throw new ApiError(400 , "You're unauthorized");
        } else {
            next();
        }

    } catch (error) {
        throw new ApiError(500 , error?.message || "Something went wrong")
    }
})
