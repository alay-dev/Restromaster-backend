import { NextFunction, Request, Response } from "express";
const AppError = require("../utils/appError");
import { AppDataSource } from "../data-source";
import { Dish } from "../entity/Dish";
import { Restaurant } from "../entity/Restaurant";

export const getAllDish = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { restaurant_id } = req.params;

  if (!restaurant_id) return next(new AppError("Incomplete information", 400));

  const dishRepository = AppDataSource.getRepository(Dish);
  const restaurantRepository = AppDataSource.getRepository(Restaurant);

  const restaurant = await restaurantRepository.findOneBy({
    id: restaurant_id,
  });

  if (!restaurant)
    return next(new AppError("No restaurant exists with that ID", 400));

  try {
    let dishes = await dishRepository.findBy({
      restaurant: restaurant,
    });

    dishes = dishes.map((dish) => {
      return {
        ...dish,
        image: JSON.parse(dish.image),
      };
    });

    res.status(200).json({
      status: "success",
      data: dishes,
      message: "All dishes fetched",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(err.detail, 400));
  }
};

export const addDish = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { restaurant_id, name, description, price, images, category } = req.body;

  if (!restaurant_id || !name || !description || !price || !category)
    return next(new AppError("Incomplete information", 400));

  const dishRepository = AppDataSource.getRepository(Dish);
  const restaurantRepository = AppDataSource.getRepository(Restaurant);

  const restaurant = await restaurantRepository.findOne({
    relations: { dishes: true },
    where: {
      id: restaurant_id,
    },
  });

  if (!restaurant)
    return next(new AppError("No restaurant exists with that ID", 404));

  try {
    const dish = new Dish();
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image = JSON.stringify(images);
    dish.category = category;
    dish.restaurant = restaurant;

    const { id } = await dishRepository.save(dish);

    // restaurant.dishes = [...restaurant.dishes, dish];

    // await restaurantRepository.save(restaurant);

    res.status(201).json({
      status: "success",
      data: {
        dish_id: id,
      },
      message: "Dish created",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(err.detail, 400));
  }
};

export const updateDish = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { dish_id, name, description, price, image } = req.body;

  if (!dish_id || !name || !description || !price)
    return next(new AppError("Incomplete information", 400));

  const dishRepository = AppDataSource.getRepository(Dish);

  const dish = await dishRepository.findOneBy({ id: dish_id });
  if (!dish) return next(new AppError("No dish found with that ID", 404));

  try {
    dish.description = description;
    dish.name = name;
    dish.price = price;
    dish.image = image;

    await dishRepository.update(dish_id, dish);

    res.status(201).json({
      status: "success",
      data: {
        dish_id: dish_id,
      },
      message: "Dish updated",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(err.detail, 400));
  }
};
