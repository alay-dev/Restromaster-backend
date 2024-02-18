const express = require("express");
import {
  bookTable,
  createRestaurant,
  getBookings,
  getRestaurant,
  updateRestaurant,
} from "../controllers/restaurantController";
import { protect } from "../controllers/authController";

const router = express.Router();

router.post("/create_restaurant", protect, createRestaurant);
router.put("/update_restaurant", protect, updateRestaurant);
router.post("/book_table", bookTable);
router.get("/get_table_booking/:restaurant_id", protect, getBookings);
router.get("/:restaurant_id", getRestaurant);

module.exports = router;

export {};
