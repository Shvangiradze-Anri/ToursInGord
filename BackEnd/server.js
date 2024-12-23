import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createClient } from "@redis/client";

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
    "default-src 'self'; script-src 'self' https://trusted-cdn.com; connect-src 'self' https://toursingord.netlify.app; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
  );
  next();
});

const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

await redisClient.connect();

const loadRoutes = async () => {
  try {
    const { router } = await import("./routes/authRoutes.js");
    app.use("/", router);

    const { adminRouter } = await import("./routes/adminRoute.js");
    app.use("/", adminRouter);
  } catch (error) {
    console.error("Error loading routes:", error);
  }
};
loadRoutes();

app.listen(5300, () => console.log("Listening"));

export default redisClient;
