const express = require("express");
import {
  signup,
  login,
  protect,
  loginWithGoogle,
  forgotPassword,
} from "./../controllers/authController";
import {
  getUser,
  updateProfilePic,
  updateUser,
} from "../controllers/userController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/login_with_google", loginWithGoogle);
router.get("/forgot_password/:email", forgotPassword);
router.get("/me", protect, getUser);
router.post("/update_user", protect, updateUser);
router.post("/update_profile_pic", protect, updateProfilePic);

module.exports = router;

export {};
