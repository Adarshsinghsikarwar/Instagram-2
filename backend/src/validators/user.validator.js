import { param } from "express-validator";
import { validate } from "../middlewares/validate.js";

export const validateFollowUser = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),
  validate,
];

export const validateFollowRequest = [
  param("requestId")
    .notEmpty()
    .withMessage("Request ID is required")
    .isMongoId()
    .withMessage("Request ID must be a valid MongoDB ObjectId"),
  validate,
];
