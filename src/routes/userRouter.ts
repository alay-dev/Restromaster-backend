const express = require("express");
import { signup, login, protect } from "./../controllers/authController";
import { getUser } from "../controllers/userController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getUser);

module.exports = router;

export {};
