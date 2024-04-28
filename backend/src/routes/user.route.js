import Router from "express";
import { loginUser, registerUser,profileUser,refreshAccessToken,logoutUser } from "../controllers/User.controller.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile").get(profileUser);
router.route("/refreshToken").get(refreshAccessToken);
router.route("/logout").get(logoutUser);
export default router;
