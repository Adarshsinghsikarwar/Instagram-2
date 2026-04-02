import { Router } from "express";
import {
  registerValidation,
  loginValidation,
} from "../validators/auth.validator.js";
import {
  register,
  login,
  getMe,
  googleCallback,
} from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";
import passport from "passport";

const authRouter = Router();

// /api/auth/register
authRouter.post("/register", registerValidation, register);

// /api/auth/login
authRouter.post("/login", loginValidation, login);

// /api/auth/me
authRouter.get("/me", authUser, getMe);

// Google OAuth routes

// /api/auth/google
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
// /api/auth/google/callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
//   (req, res,next) => {
//     console.log(req.user);
//     res.json({ success: true, user: req.user });
//     next();
//   },
  googleCallback
);

export default authRouter;
