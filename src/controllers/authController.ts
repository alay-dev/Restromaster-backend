import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
const userRepository = AppDataSource.getRepository(User);
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");
import { promisify } from "util";
import { UserRequest } from "../types/global";

const signToken = (id: string) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user: User, statusCode: number, res: Response) => {
  const token = signToken(user.id);
  //Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      token,
      user,
    },
  });
};

const generatePasswordHash = async (password: string) => {
  return bcrypt.hash(password, 12);
};

const checkCorrectPassword = async (
  candidatePassword: string,
  userPassword: string
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const signup = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.body.password !== req.body.confirmPassword) {
    //  send bad request
  }

  const user = new User();
  user.email = req.body.email;
  user.name = req.body.name;
  user.password = await generatePasswordHash(req.body.password);

  try {
    const { id } = await userRepository.save(user);

    res.status(201).json({
      status: "success",
      data: {
        user_id: id,
      },
      message: "Signup successful!",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(err.detail, 400));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  const user = await userRepository.findOneBy({ email: email });
  if (!user) return next(new AppError("No user found with that email", 404));

  const correctPassword = await checkCorrectPassword(password, user.password);
  if (!correctPassword)
    return next(
      new AppError("Incorrect username or password. Please try again", 400)
    );

  createSendToken(user, 200, res);
};

export const protect = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  //1)Get Token and ch3eck if it exists
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );

  try {
    //2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) check if the user exists
    const currentUser = await AppDataSource.getRepository(User).findOneBy({
      id: decoded.id,
    });
    if (!currentUser)
      return next(new AppError("The user no longer exist", 401));
    currentUser.password = undefined;

    console.log(currentUser, "currentzuser");

    //GRNT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
  } catch (err) {
    console.log(err);
  }

  next();
};
