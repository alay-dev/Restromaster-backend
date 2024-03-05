import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entity/Order";
import { Restaurant } from "../entity/Restaurant";
const AppError = require("../utils/appError");

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let {
    restaurant_id,
    customer_name,
    customer_phone,
    order_total,
    order_items,
  } = req.body;

  if (!restaurant_id || !customer_name || !order_total || !order_items)
    return next(new AppError("Incomplete information", 400));

  const orderRepository = AppDataSource.getRepository(Order);
  const restaurantRepository = AppDataSource.getRepository(Restaurant);

  let restaurant;

  try {
    restaurant = await restaurantRepository.findOne({
      relations: { dishes: true },
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
    const order = new Order();
    order.customer_name = customer_name;
    order.customer_phone = customer_phone;
    order.order_items = JSON.stringify(order_items);
    order.order_total = parseInt(String(order_total * 100));
    order.restaurant = restaurant;
    order.created_at = new Date();

    const { id } = await orderRepository.save(order);

    res.status(201).json({
      status: "success",
      data: {
        order_id: id,
      },
      message: "Order created",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(err.detail, 400));
  }
};

export const markOrderPaid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.body;
  if (!order_id) return next(new AppError("Incomplete information", 400));

  const orderRepository = AppDataSource.getRepository(Order);

  try {
    const order = await orderRepository.findOne({
      where: {
        id: order_id,
      },
    });

    if (!order) return next(new AppError("No order exists with that ID", 404));
    order.paid = true;
    await orderRepository.update(order_id, order);
    res.status(200).json({
      status: "success",
      data: {
        order_id: order.id,
      },
      message: "Order updated",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(err.detail, 400));
  }
};

export const getRestaurantOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { restaurant_id } = req.params;

  if (!restaurant_id) return next(new AppError("Incomplete information", 400));

  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const orderRepository = AppDataSource.getRepository(Order);

  const restaurant = await restaurantRepository.findOneBy({
    id: restaurant_id,
  });

  if (!restaurant)
    return next(new AppError("No restaurant exists with that ID", 400));

  try {
    let orders = await orderRepository.find({
      where: {
        restaurant: restaurant,
      },
      order: {
        created_at: "DESC",
      },
    });

    orders = orders.map((order) => {
      return {
        ...order,
        order_items: JSON.parse(order.order_items),
        order_total: order.order_total / 100,
      };
    });

    res.status(200).json({
      status: "success",
      data: orders,
      message: "All orders fetched",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(err.detail, 400));
  }
};
