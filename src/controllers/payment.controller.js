import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { Payment } from "../models/payment.model.js";
import { Booking } from "../models/booking.model.js";
import { Cashfree } from "cashfree-pg";
import { User } from "../models/user.model.js";
import { load } from "@cashfreepayments/cashfree-js";

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.Environment = Cashfree.Environment.SANDBOX;

export const makePayment = asyncHandler(async (req, res) => {

  const { bookingId } = req.params;

   console.log("Booking Id : ", bookingId);

  if (!bookingId) {
    throw new ApiError(400, "Booking Id is required");
  }

  const booking = await Booking.findById(bookingId).select(
    "totalAmount userId bookingStatus"
  );

  console.log("Booking : ", booking);

  if (!booking) {
    throw new ApiError(400, "Booking not found");
  }

  if (booking.bookingStatus === "cancelled") {
    throw new ApiError(400, "Booking is already cancelled");
  }

  if (booking.bookingStatus === "confirm") {
    throw new ApiError(400, "Booking is already confirmed");
  }

  const { totalAmount } = booking;

  let paymentRequest = {
    order_id: bookingId,
    order_currency: "INR",
    order_amount: totalAmount,
    customer_details: {
      customer_id: req.user._id.toString(),
      customer_phone: req.user.userContactNumber.toString(),
      customer_email: req.user.email,
      customer_name: req.user.firstName + " " + req.user.lastName,
    },
  };

  Cashfree.PGCreateOrder("2023-08-01", paymentRequest)
    .then((response) => {
      console.log("Payment Response : ", response.data);
      return res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

});
