import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createClient } from "@redis/client";
import compression from "compression"; // Import compression

dotenv.config();
const app = express();

const bodyParserOptions = { limit: "200kb" };
mongoose
  .connect(process.env.MongoDB_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

app.use(compression()); // Enable compression middleware
app.use(express.json(bodyParserOptions));
app.use(express.urlencoded({ extended: true, ...bodyParserOptions }));
app.use(cookieParser());

app.use((req, res, next) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const serverUrl = process.env.SERVER_URL || "http://localhost:5300";

  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' https://trusted-cdn.com; connect-src 'self' ${clientUrl} ${serverUrl}; style-src 'self' 'unsafe-inline'; img-src 'self' data:;`
  );
  next();
});

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

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
