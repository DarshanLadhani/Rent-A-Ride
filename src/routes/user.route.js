import { Router } from "express";
import { changeUserPassword, getUserInfo, loginUser, logoutUser, registerUser, updateUserAccountDetails } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// User must be login for this routes
router.route("/logout").post(verifyJwt , logoutUser)
router.route("/updateaccountdetails").post(verifyJwt , updateUserAccountDetails)
router.route("/changeuserpassword").post(verifyJwt , changeUserPassword)
router.route("/updateaccountdetails").patch(verifyJwt , updateUserAccountDetails)
router.route("/getuserinfo").get(verifyJwt , getUserInfo)

export default router;