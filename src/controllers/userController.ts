import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Restaurant } from "../entity/Restaurant";
import { UserRequest } from "../types/global";

export const getUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const restaurant = await restaurantRepository.findOneBy({ user: req.user });
  if (restaurant) {
    restaurant.dish_category = restaurant?.dish_category
      ? JSON.parse(restaurant?.dish_category)
      : [];
  }

  res.status(200).json({
    status: "success",
    message: "User data fetched",
    data: {
      ...req.user,
      restaurant: restaurant,
    },
  });
};

export const updateUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, phone_no, picture } = req.body;
  const user_id = req.user.id;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id: user_id });

  try {
    user.name = name;
    user.phone_no = phone_no;
    user.picture = picture;

    res.status(200).json({
      status: "success",
      message: "User data updated",
      data: {
        ...req.user,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
