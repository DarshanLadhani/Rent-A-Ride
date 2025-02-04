import { Router } from "express";
import { makePayment } from "../controllers/payment.controller.js";
import {verifyJwt} from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt)

router.route("/makePayment/:bookingId").get(makePayment);

export default router