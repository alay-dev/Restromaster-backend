import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
const userRepository = AppDataSource.getRepository(User);
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");
import { promisify } from "util";
import { UserRequest } from "../types/global";
const { OAuth2Client } = require("google-auth-library");
// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
  if (!user) return next(new AppError("Not found", 404));

  const correctPassword = await checkCorrectPassword(password, user.password);
  if (!correctPassword)
    return next(
      new AppError("Incorrect username or password. Please try again", 400)
    );

  createSendToken(user, 200, res);
};

export const loginWithGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;

  if (!token) return next(new AppError("Google token is missing", 400));

  try {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const user = await userRepository.findOneBy({ email: payload.email });

    if (!user) {
      return next(new AppError("Not found", 404));
    } else {
      createSendToken(user, 200, res);
    }
  } catch (error) {
    console.log(error);
  }
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

    //GRNT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
  } catch (err) {
    console.log(err);
  }

  next();
};

// export const forgotPassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { email } = req.params;

//   if (!email)
//     return next(new AppError("Please provide email and password", 400));

//   const request = {
//     url: `/v3/api_keys`,
//     method: "GET",
//   };

//   // const user = await userRepository.findOneBy({ email: email });
//   // if (!user) return next(new AppError("No user found with that email", 404));

//   console.log(sgMail, email);

//   const msg = {
//     to: email, // Change to your recipient
//     from: "narualay030@gmail.com", // Change to your verified sender
//     subject: "Sending with SendGrid is Fun",

//     html: "<strong>and easy to do anywhere, even with Node.js</strong>",
//   };

//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch((error) => {
//       console.error(error.response.body);
//     });
// };
