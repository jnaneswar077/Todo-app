import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser,
  updateEmailNotificationSettings,
  getEmailNotificationSettings
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/email-notifications").get(verifyJWT, getEmailNotificationSettings);
router.route("/email-notifications").put(verifyJWT, updateEmailNotificationSettings);

export default router;
