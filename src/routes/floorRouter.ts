const express = require("express");

import { protect } from "../controllers/authController";
import {
  addFloor,
  deleteFloor,
  getAllFloor,
  updateFloor,
} from "../controllers/floorController";

const router = express.Router();

router.get("/:restaurant_id", protect, getAllFloor);
router.post("/add_floor", protect, addFloor);
router.put("/update_floor", protect, updateFloor);
router.delete("/delete_floor", protect, deleteFloor);

module.exports = router;

export {};
