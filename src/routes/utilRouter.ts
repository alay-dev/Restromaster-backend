const express = require("express");

import { protect } from "../controllers/authController";
import { getPhotos } from "../controllers/utilController";

const router = express.Router();

router.get("/get_photos/:keyword", getPhotos);

module.exports = router;

export {};
