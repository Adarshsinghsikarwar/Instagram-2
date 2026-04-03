import { param } from "express-validator";
import { validate } from "../middlewares/validate.js";

export const validateFollowUser = [
  param("userId")
    .isEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),
  validate,
];
