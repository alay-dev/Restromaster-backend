const express = require("express")
import {createRestaurant, updateRestaurant } from "../controllers/restaurantController"
import {protect } from "../controllers/authController"

const router = express.Router();

router.post("/create_restaurant", protect,  createRestaurant)
router.put("/update_restaurant", protect,  updateRestaurant)

module.exports = router

export {}