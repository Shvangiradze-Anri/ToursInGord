import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { router } from "./routes/authRoutes.js";
import mongoose from "mongoose";
import { adminRouter } from "./routes/adminRoute.js";

dotenv.config();
const app = express();

const bodyParserOptions = { limit: "200kb" };
const IMAGE_COOKIE_MAX_SIZE = 200 * 1024;

mongoose
  .connect(process.env.MongoDB_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

app.use(express.json(bodyParserOptions));
app.use(express.urlencoded({ extended: true, ...bodyParserOptions }));
app.use(cookieParser());

app.use("/", router);
app.use("/", adminRouter);

app.listen(5300, () => console.log("Listening"));
