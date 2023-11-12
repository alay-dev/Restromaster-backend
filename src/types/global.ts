import { Request } from "express";
import { User } from "../entity/User";

export interface UserRequest extends Request {
  user?: User;
}
