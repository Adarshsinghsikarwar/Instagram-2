import express from "express";
import authRouter from "./routes/auth.route.js";
import postRouter from "./routes/post.route.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routes/user.route.js";
import storyRouter from "./routes/story.routes.js";
import chatRouter from "./routes/chat.route.js";

const app = express();
app.use(morgan("dev"));
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:5174"],
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     credentials: true,
//   })
// );

app.use(express.json());
app.use(express.static("public")); // Serve static files from the "public" directory
// app.use(); // Handle multipart/form-data for file uploads
app.use(cookieParser());
app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Here you would typically find or create a user in your database
      // For this example, we'll just return the profile
      return done(null, profile);
    }
  )
);

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/stories", storyRouter);
app.use("/api/chats", chatRouter);

app.get("*name", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});
app.get("/", (req, res) => {
  res.json({ message: "Instagram API Server" });
});

export default app;
