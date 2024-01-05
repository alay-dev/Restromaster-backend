import { NextFunction, Request, Response } from "express";
const cors = require("cors");

const express = require("express");
const userRouter = require("./routes/userRouter");
const restaurantRouter = require("./routes/restaurantRouter");
const floorRouter = require("./routes/floorRouter");
const dishRouter = require("./routes/dishRouter");
const utilRouter = require("./routes/utilRouter");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);

// app.use(pino)
// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/users", userRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/floor", floorRouter);
app.use("/api/dish", dishRouter);
app.use("/api/util", utilRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
