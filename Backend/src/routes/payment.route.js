import { Router } from "express";
import { makePayment, verifyPayment } from "../controllers/payment.controller.js";
import {verifyJwt} from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt)

router.route("/makePayment/:bookingId").post(makePayment);
router.route("/verify").post(verifyPayment);

export default router