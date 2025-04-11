import { Router } from "express";
import { restrictTo, verifyJwt } from "../middlewares/auth.middleware.js";
import { addBike, bookFromSearchedBikes, getBike, getBikes, removeBike, searchBikes, updateBikeDetails, updateBikeImage } from "../controllers/bike.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJwt)

router.route("/admin/addBike").post(restrictTo,  upload.single("bikeImage") , addBike);
router.route("/admin/getAllBikes").get(restrictTo , getBikes);
router.route("/admin/getBike/:bikeId").get(restrictTo , getBike)
router.route("/admin/removeBike/:bikeId").delete(restrictTo , removeBike);
router.route("/admin/updateBikeDetails/:bikeId").patch(restrictTo , updateBikeDetails);
router.route("/admin/updateBikeImage/:bikeId").patch(restrictTo , upload.single("bikeImage") ,updateBikeImage);
router.route("/search").post(searchBikes)
router.route("/search/:bikeId").post(bookFromSearchedBikes)

export default router;