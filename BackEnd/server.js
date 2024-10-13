import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { router } from "./routes/authRoutes.js";
import mongoose from "mongoose";
import { adminRouter } from "./routes/adminRoute.js";

dotenv.config();
const app = express();

const bodyParserOptions = { limit: "200kb" };
mongoose
  .connect(process.env.MongoDB_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

app.use(express.json(bodyParserOptions));
app.use(express.urlencoded({ extended: true, ...bodyParserOptions }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' http://localhost:5173; script-src 'self' https://trusted-cdn.com"
  );
  next();
});

app.use("/", router);
app.use("/", adminRouter);

app.listen(5300, () => console.log("Listening"));
