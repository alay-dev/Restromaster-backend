const express = require("express");
import {
  bookTable,
  createRestaurant,
  getBookings,
  getRestaurant,
  getTableAvailable,
  updateRestaurant,
  updateRestaurantImage,
} from "../controllers/restaurantController";
import { protect } from "../controllers/authController";

const router = express.Router();

router.post("/create_restaurant", protect, createRestaurant);
router.put("/update_restaurant", protect, updateRestaurant);
router.put("/update_restaurant_image", protect, updateRestaurantImage);
router.post("/book_table", bookTable);
router.get("/get_table_booking/:restaurant_id", protect, getBookings);
router.get("/:restaurant_id", getRestaurant);
router.post("/get_table_availabilty", getTableAvailable);

module.exports = router;

export {};
