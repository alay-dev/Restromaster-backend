const express = require("express");

import { protect } from "../controllers/authController";
import { addDish, getAllDish } from "../controllers/dishController";

const router = express.Router();

router.post("/add_dish", protect, addDish);
router.get("/get_dishes/:restaurant_id", protect, getAllDish);

module.exports = router;

export {};
