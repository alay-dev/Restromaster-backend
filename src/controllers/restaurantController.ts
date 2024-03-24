import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Restaurant } from "../entity/Restaurant";
import { BookedTable } from "../entity/bookedTable";
const AppError = require("../utils/appError");

const bookingTimes = [
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 AM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
];

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
    cta,
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
    restaurant.cta = cta;
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

export const updateRestaurantImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { cover_pic, restaurant_id } = req.body;

  if (!restaurant_id || !cover_pic)
    return next(new AppError("Incomplete information", 400));

  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const restaurant = await restaurantRepository.findOneBy({
    id: restaurant_id,
  });
  if (!restaurant)
    return next(new AppError("No restaurant exists with that ID", 404));

  try {
    restaurant.cover_pic = cover_pic || restaurant.cover_pic;

    await restaurantRepository.update(restaurant_id, restaurant);

    res.status(200).json({
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

export const updateRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let {
    restaurant_id,
    name,
    type,
    cover_pic,
    description,
    cta,
    address,
    phone_no,
    email,
  } = req.body;

  if (!restaurant_id || !name || !type)
    return next(new AppError("Incomplete information", 400));

  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const restaurant = await restaurantRepository.findOneBy({
    id: restaurant_id,
  });
  if (!restaurant)
    return next(new AppError("No restaurant exists with that ID", 404));

  try {
    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.cover_pic = cover_pic || restaurant.cover_pic;
    restaurant.address = address || restaurant.address;
    restaurant.phone_no = phone_no || restaurant.phone_no;
    restaurant.email = email || restaurant.email;
    restaurant.cta = cta || restaurant.cta;

    await restaurantRepository.update(restaurant_id, restaurant);

    res.status(200).json({
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

export const bookTable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurant_id, customer_name, phone_no, table_id, date, time, note } =
    req.body;

  if (!restaurant_id || !customer_name || !phone_no || !table_id || !time)
    return next(new AppError("Incomplete information", 400));

  const bookedTableRepository = AppDataSource.getRepository(BookedTable);
  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const restaurant = await restaurantRepository.findOneBy({
    id: restaurant_id,
  });
  if (!restaurant)
    return next(new AppError("No restaurant exists with that ID", 404));

  try {
    const bookedTable = new BookedTable();

    bookedTable.customer_name = customer_name;
    bookedTable.phone_no = phone_no;
    bookedTable.date = date;
    bookedTable.time = time;
    bookedTable.table_id = table_id;
    bookedTable.note = note;
    bookedTable.restaurant = restaurant;

    await bookedTableRepository.save(bookedTable);

    res.status(201).json({
      status: "success",
      message: "Book table success",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error while booking table", 400));
  }
};

export const getBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurant_id } = req.params;

  if (!restaurant_id) return next(new AppError("Incomplete information", 400));

  const bookedTableRepository = AppDataSource.getRepository(BookedTable);
  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const restaurant = await restaurantRepository.findOneBy({
    id: restaurant_id,
  });
  if (!restaurant)
    return next(new AppError("No restaurant exists with that ID", 404));

  try {
    const bookings = await bookedTableRepository.findBy({
      restaurant: restaurant,
    });

    res.status(200).json({
      status: "success",
      message: "All bookings fetched",
      data: bookings,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error while fetching bookings", 400));
  }
};

export const getRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurant_id } = req.params;

  if (!restaurant_id) return next(new AppError("Incomplete information", 400));

  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const restaurant = await restaurantRepository.findOneBy({
    id: restaurant_id,
  });

  if (!restaurant)
    return next(new AppError("No restaurant exists with that ID", 404));

  try {
    res.status(200).json({
      status: "success",
      message: "Restaurant fetched",
      data: restaurant,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error while fetching restaurant", 400));
  }
};

export const getTableAvailable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurant_id, date, table_id } = req.body;

  if (!restaurant_id) return next(new AppError("Incomplete information", 400));

  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const bookedTableRepository = AppDataSource.getRepository(BookedTable);
  const restaurant = await restaurantRepository.findOneBy({
    id: restaurant_id,
  });

  if (!restaurant)
    return next(new AppError("No restaurant exists with that ID", 404));

  const bookings = await bookedTableRepository.findBy({
    date: new Date(date),
    restaurant: restaurant,
    table_id: table_id?.toString(),
  });

  const availabilty = bookingTimes?.map((time) => {
    return {
      time: time,
      is_available: bookings?.findIndex((item) => item.time === time)
        ? true
        : false,
    };
  });

  try {
    res.status(200).json({
      status: "success",
      message: "Table availability fetched",
      data: availabilty,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error while fetching table availability", 400));
  }
};
