import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee";
import { Restaurant } from "../entity/Restaurant";
const AppError = require("../utils/appError");

export const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let {
    restaurant_id,
    first_name,
    last_name,
    phone,
    email,
    designation,
    date_of_birth,
    photo,
  } = req.body;

  if (
    !restaurant_id ||
    !first_name ||
    !last_name ||
    !email ||
    !designation ||
    !date_of_birth ||
    !photo
  )
    return next(new AppError("Incomplete information", 400));

  const employeeRepository = AppDataSource.getRepository(Employee);
  const restaurantRepository = AppDataSource.getRepository(Restaurant);

  let restaurant;

  try {
    restaurant = await restaurantRepository.findOne({
      where: {
        id: restaurant_id,
      },
    });

    if (!restaurant)
      return next(new AppError("No restaurant exists with that ID", 404));
  } catch (err) {
    console.log(err);
    return next(new AppError(err.detail, 400));
  }

  try {
    const employee = new Employee();
    employee.created_at = new Date();
    employee.date_of_birth = date_of_birth;
    employee.designation = designation;
    employee.email = email;
    employee.phone = phone;
    employee.photo = photo;
    employee.first_name = first_name;
    employee.last_name = last_name;
    employee.restaurant = restaurant;

    const { id } = await employeeRepository.save(employee);

    res.status(201).json({
      status: "success",
      data: {
        employee: id,
      },
      message: "Employee created",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(err.detail, 400));
  }
};

export const getEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { restaurant_id } = req.params;

  if (!restaurant_id) return next(new AppError("Incomplete information", 400));

  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const employeeRepository = AppDataSource.getRepository(Employee);

  const restaurant = await restaurantRepository.findOneBy({
    id: restaurant_id,
  });

  if (!restaurant)
    return next(new AppError("No restaurant exists with that ID", 400));

  try {
    let employees = await employeeRepository.find({
      where: {
        restaurant: restaurant,
      },
      order: {
        created_at: "DESC",
      },
    });

    res.status(200).json({
      status: "success",
      data: employees,
      message: "All employees fetched",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(err.detail, 400));
  }
};
