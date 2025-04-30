import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { Payment } from "../models/payment.model.js";
import { Booking } from "../models/booking.model.js";
import { Cashfree } from "cashfree-pg";
import axios from "axios"

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.Environment = Cashfree.Environment.SANDBOX;
const CASHFREE_BASE_URL = "https://sandbox.cashfree.com/pg/orders";

export const makePayment = asyncHandler(async (req, res) => {

  const { bookingId } = req.params;

  if (!bookingId) {
    throw new ApiError(400, "Booking Id is required");
  }

  const booking = await Booking.findById(bookingId).select(
    "totalAmount userId bookingStatus"
  );


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
      return res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, bikeId } = req.body;

  if (!orderId || !bikeId) {
    throw new ApiError(400, "Order ID and Bike ID are required");
  }

  try {
    const response = await axios.get(`${CASHFREE_BASE_URL}/${orderId}`, {
      headers: {
        accept: "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
      },
    });

    const paymentStatus = response.data.order_status;

    if (paymentStatus === "PAID") {
      await Booking.findByIdAndUpdate(orderId, {
        bookingStatus: "Confirm",
        paymentStatus: "success",
      });

      return res.status(200).json({
        message: "Payment verified successfully",
        status: "success",
      });

    } else {
      return res.status(200).json({
        message: "Payment not completed",
        status: paymentStatus,
      });
    }
  } catch (error) {
    throw new ApiError(500, "Payment verification failed");
  }
});