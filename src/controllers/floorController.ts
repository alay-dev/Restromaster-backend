import { NextFunction, Request, Response } from "express";
const AppError = require("../utils/appError");
import { AppDataSource } from "../data-source";
import { Floor } from "../entity/Floor";
import { Restaurant } from "../entity/Restaurant";

export const getAllFloor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurant_id } = req.params;

  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const restaurant = await restaurantRepository.findOne({
    relations: {
      floors: true,
    },

    where: {
      id: restaurant_id,
    },
  });

  if (!restaurant) new AppError("No restaurant exists with that ID", 404);

  const floorRepository = AppDataSource.getRepository(Floor);
  const allFloors = await floorRepository.find({
    where: {
      restaurant: restaurant,
    },
    order: {
      floor_no: "ASC",
    },
  });

  res.status(200).json({
    status: "success",
    data: allFloors,
    message: "All floors fetched",
  });
};

export const addFloor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { restaurant_id, floor_no, canvas } = req.body;

  if (!restaurant_id || !canvas)
    return next(new AppError("Incomplete information", 400));

  const restaurantRepository = AppDataSource.getRepository(Restaurant);
  const restaurant = await restaurantRepository.findOne({
    relations: {
      floors: true,
    },
    where: {
      id: restaurant_id,
    },
  });
  if (!restaurant) new AppError("No restaurant exists with that ID", 404);

  const floorRepository = AppDataSource.getRepository(Floor);
  const allFloors = await floorRepository.findBy({ restaurant: restaurant });
  allFloors.map((floor) => {
    if (floor_no === floor.floor_no) {
      return next(
        new AppError("Floor already exists. Please try updating.", 400)
      );
    }
  });

  // console.log(allFloors);

  try {
    const floor = new Floor();
    floor.canvas = canvas;
    floor.floor_no = floor_no;
    floor.restaurant = restaurant;

    let floor_id;
    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const newFloor = await transactionalEntityManager.save(floor);

        console.log(newFloor);
        restaurant.floors = [...restaurant.floors, newFloor];
        console.log(restaurant.id);
        // const { id } = await transactionalEntityManager.save(restaurant);
        // console.log(id);

        floor_id = newFloor.id;
      }
    );

    res.status(201).json({
      status: "success",
      data: {
        floor_id: floor_id,
      },
      message: "Floor created",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error while creating floor", 400));
  }
};

export const updateFloor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { floor_id, restaurant_id, floor_no, canvas } = req.body;

  if (!restaurant_id || !canvas || !floor_id)
    return next(new AppError("Incomplete information", 400));

  const floorRepository = AppDataSource.getRepository(Floor);
  const floor = await floorRepository.findOne({
    relations: { restaurant: true },
    where: { id: floor_id },
  });

  if (!floor) return next(new AppError("No floor exists with that ID", 404));

  if (floor.restaurant.id !== restaurant_id) {
    return next(
      new AppError("This floor doesnt belong to this restaurant", 400)
    );
  }

  try {
    floor.canvas = canvas;
    floor.floor_no = floor_no;
    floor.restaurant = restaurant_id;
    await floorRepository.update(floor_id, floor);

    res.status(200).json({
      status: "success",
      data: {
        floor_id: floor_id,
      },
      message: "Floor updated",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error while updating floor", 400));
  }
};

export const deleteFloor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { floor_id } = req.params;

  if (!floor_id) return next(new AppError("Incomplete information", 400));

  const floorRepository = AppDataSource.getRepository(Floor);
  const floor = await floorRepository.findOneBy({ id: floor_id });

  if (!floor) return next(new AppError("No floor exists with that ID", 404));

  try {
    await floorRepository.delete(floor_id);

    res.status(200).json({
      status: "success",
      data: {
        floor_id: floor_id,
      },
      message: "Floor deleted",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Error while deleting floor", 400));
  }
};
