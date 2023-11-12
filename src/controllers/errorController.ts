import { NextFunction, Request, Response } from "express";
const AppError = require("../utils/appError")

module.exports = (err: typeof AppError, req :Request, res : Response, next :NextFunction) => {
    err.statusCode = err?.statusCode || 500;
    err.status = err?.status || 'error';
    err.message = err?.message || "Something went wrong" ;

    console.log(err)
  
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    
};