import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js"
import { ApiResponse } from "../utils/apiResponse.util.js";
import { console } from "inspector";

// Creating a method to generate refresh and access tokens
const generateAccessToken = async function (userid) {
  try {
    const user = await User.findById(userid);
    const accessToken = await user.generateAccessToken();

    return accessToken;

  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, userContactNumber , role} = req.body;

  // Validations
  if (
    [firstName, lastName, email, password , role].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!email.includes("@")) {
    throw new ApiError(400, "Invalid email address");
  }

  if (
    !password ||
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  ) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long, contain at least one uppercase letter, and one number."
    );
  }

  if (!userContactNumber || !/^[6-9]\d{9}$/.test(userContactNumber)) {
    throw new ApiError(
      400,
      "Invalid contact number. It must be a 10-digit number starting with 6, 7, 8, or 9."
    );
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { userContactNumber }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email and contact number already exits");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    userContactNumber,
    role
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {

  
  const { userContactNumber, password } = req.body;
  
  if (!userContactNumber || !/^[6-9]\d{9}$/.test(userContactNumber)) {
    throw new ApiError(
      400,
      "Invalid contact number. It must be a 10-digit number starting with 6, 7, 8, or 9."
    );
  }

  
  const user = await User.findOne({ userContactNumber });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Password is incorrect");
  }

  const accessToken  = await generateAccessToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password");

  const cookiesOptions = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .json(
      new ApiResponse(200, { user: loggedInUser }, "User LoggedIn Successfully")
    );
});

export const logoutUser = asyncHandler(async (req,res) => {
  if (!req.user) {
    throw new ApiError(400 , "User must be LoggedIn")
  }

  const cookiesOptions = {
    httpOnly : true,
    secure : true,
}

  return res
      .status(200)
      .clearCookie("accessToken" , cookiesOptions)
      .json(new ApiResponse(200 , {} , "User logout successfully"))
});

export const updateUserAccountDetails = asyncHandler(async (req , res) => {
  const {firstName , lastName , email , userContactNumber} = req.body;

  if (!email.includes("@")) {
    throw new ApiError(400, "Invalid email address");
  }

  if (!userContactNumber || !/^[6-9]\d{9}$/.test(userContactNumber)) {
    throw new ApiError(
      400,
      "Invalid contact number. It must be a 10-digit number starting with 6, 7, 8, or 9."
    );
  }

  const user = await User.findByIdAndUpdate(req.user?._id , {
    $set : {
      firstName,
      lastName,
      email,
      userContactNumber
    }
  } , {new : true}).select("-password") // // By Using {new : true} we get updated info in return
  
  return res.status(200).json(new ApiResponse(200 , user , "User details updated successfully"))

});

export const changeUserPassword = asyncHandler (async (req , res) => {
  const {oldPassword , newPassword , confirmPassword} = req.body;

  if (!oldPassword) {
    throw new ApiError(400 , "Please provide the old password")
  }

  if (
    !newPassword ||
    newPassword.length < 8 ||
    !/[A-Z]/.test(newPassword) ||
    !/\d/.test(newPassword)
  ) {
    throw new ApiError(
      400,
      "New Password must be at least 8 characters long, contain at least one uppercase letter, and one number."
    );
  }

  const user = await User.findById(req.user?._id);

  const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new ApiError(400 , "Invalid Old Password");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400 , "New password and old password is not matching");
  }

  user.password = newPassword;
  await user.save({validateBeforeSave : false})

  return res.status(200).json(new ApiResponse(200 , {} ,  "Password changed successfully"))

});

export const getUserInfo = asyncHandler(async (req , res) => {
  return res.status(200).json(new ApiResponse(200 , req.user , "Current User Fetched Successfully"));
});

export const getUserBooking = asyncHandler(async(req , res) => {
    const booking = await Booking.find({});
  
    if (!booking || booking.length === 0) {
      throw new ApiError(404 , "No Booking found in the system for user.")
    }
  
    return res.status(200).json(new ApiResponse(200 , booking , "Bookings retrived successfully"))
})
