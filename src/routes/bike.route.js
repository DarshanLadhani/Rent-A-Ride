import { Router } from "express";
import { restrictTo, verifyJwt } from "../middlewares/auth.middleware.js";
import { addBike, getBike, getBikes, removeBike, updateBikeDetails, updateBikeImage } from "../controllers/bike.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJwt)

router.route("/addBike").post(restrictTo,  upload.single("bikeImage") , addBike);
router.route("/getBikes").get(restrictTo , getBikes);
router.route("/getBike/:bikeId").get(restrictTo , getBike)
router.route("/removeBike/:bikeId").delete(restrictTo , removeBike);
router.route("/updateBikeDetails/:bikeId").patch(restrictTo , updateBikeDetails);
router.route("/updateBikeImage/:bikeId").patch(restrictTo , upload.single("bikeImage") ,updateBikeImage);

export default router;