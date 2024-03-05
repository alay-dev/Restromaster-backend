const express = require("express");

import { protect } from "../controllers/authController";
import {
  createOrder,
  getRestaurantOrders,
  markOrderPaid,
} from "../controllers/oderController";

const router = express.Router();

router.post("/create_order", protect, createOrder);
router.get("/:restaurant_id", protect, getRestaurantOrders);
router.post("/mark_order_paid", protect, markOrderPaid);

module.exports = router;

export {};
