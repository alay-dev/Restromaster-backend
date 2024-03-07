const express = require("express");

import { protect } from "../controllers/authController";
import {
  createEmployee,
  getEmployees,
} from "../controllers/employeeController";

const router = express.Router();

router.post("/add_employee", protect, createEmployee);
router.get("/get_employee/:restaurant_id", protect, getEmployees);

module.exports = router;

export {};
