import { Router } from "express";
import { restrictTo, verifyJwt } from "../middlewares/auth.middleware.js";
import { addBike, getBike, getBikes, removeBike, updateBikeDetails } from "../controllers/bike.controller.js";

const router = Router();

router.use(verifyJwt)

router.route("/addBike").post(restrictTo , addBike);
router.route("/getBikes").get(restrictTo , getBikes);
router.route("/getBike/:bikeId").get(restrictTo , getBike)
router.route("/removeBike/:bikeId").delete(restrictTo , removeBike);
router.route("/updateBike/:bikeId").patch(restrictTo , updateBikeDetails);

export default router;