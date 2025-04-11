import { Router } from "express";
import { restrictTo, verifyJwt } from "../middlewares/auth.middleware.js";
import { bookSelectedBike } from "../controllers/booking.controller.js";

const router = Router();

router.use(verifyJwt)

router.route("/bookBike/:bikeId").post(bookSelectedBike);

export default router