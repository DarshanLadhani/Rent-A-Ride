import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index : true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    userContactNumber: {
      type: Number,
      required: true,
      unique : true,
    },
    userRentalHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware function for hasing password before storing
userSchema.pre("save" , async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password , 10);

  next()
})

// Custom method for password checking
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password , this.password)
}

// Custom method to generate access tokens
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userContactNumber : this.userContactNumber,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const User = new mongoose.model("User", userSchema);
