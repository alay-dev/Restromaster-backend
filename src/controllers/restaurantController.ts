import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Restaurant } from "../entity/Restaurant";
const AppError = require("../utils/appError");

export const createRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let {
    user_id,
    name,
    type,
    cover_pic,
    description,
    address,
    email,
    phone_no,
  } = req.body;

  if (!user_id || !name || !type || !address)
    return next(new AppError("Incomplete information", 400));
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id: user_id });

  if (!user) return next(new AppError("No user found with that Id", 404));
  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const restaurant = await restaurantRepository.findOneBy({ user: user });
  if (restaurant)
    return next(
      new AppError("You already have a restaurant. Please try editing.", 400)
    );

  try {
    const restaurant = new Restaurant();
    restaurant.name = name;
    restaurant.type = type;
    restaurant.description = description;
    restaurant.cover_pic = cover_pic;
    restaurant.address = address;
    restaurant.phone_no = phone_no;
    restaurant.email = email;
    restaurant.user = user;
    const { id } = await restaurantRepository.save(restaurant);

    res.status(201).json({
      status: "success",
      data: {
        restaurant_id: id,
      },
      message: "Restaurant created",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error while creating restaurant", 400));
  }
};

export const updateRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { restaurant_id, name, type, cover_pic, description } = req.body;

  if (!restaurant_id || !name || !type)
    return next(new AppError("Incomplete information", 400));

  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const restaurant = await restaurantRepository.findOneBy({
    id: restaurant_id,
  });
  if (!restaurant)
    return next(new AppError("No restaurant exists with that ID", 404));

  try {
    restaurant.name = name;
    restaurant.type = type;
    restaurant.description = description;
    restaurant.cover_pic = cover_pic;

    await restaurantRepository.update(restaurant_id, restaurant);

    res.status(201).json({
      status: "success",
      data: {
        restaurant_id: restaurant_id,
      },
      message: "Restaurant updated",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error while creating restaurant", 400));
  }
};

export const addDishCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurant_id, category } = req.body;

  if (!restaurant_id || !category)
    return next(new AppError("Incomplete information", 400));

  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const restaurant = await restaurantRepository.findOneBy({
    id: restaurant_id,
  });
  if (!restaurant)
    return next(new AppError("No restaurant exists with that ID", 404));

  try {
    const categoris = restaurant.dish_category
      ? JSON.parse(restaurant.dish_category)
      : [];

    const newCategoris = [...new Set([...categoris, category])];
    restaurant.dish_category = JSON.stringify(newCategoris);
    await restaurantRepository.update(restaurant_id, restaurant);

    res.status(201).json({
      status: "success",
      message: "Dish category created",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error while creating restaurant", 400));
  }
};
