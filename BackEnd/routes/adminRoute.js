import express from "express";
import cors from "cors";

import {
  getUsers,
  uploadImages,
  getImages,
  deleteImage,
  deleteUser,
  updateUser,
  getUser,
} from "../controllers/adminControler.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const adminRouter = express.Router();

adminRouter.use(
  cors({
    credentials: true,
    origin: "https://toursingord.netlify.app",
  })
);

// http://localhost:5173

// https://process.env.CLIENT_HOST.netlify.app
adminRouter.use((req, res, next) => {
  const accessToken = req.cookies["accessT"];

  if (accessToken) {
    req.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  next();
});

adminRouter.post("/uploadImages", authenticateToken, uploadImages);
adminRouter.get("/images", getImages);
adminRouter.get("/users", authenticateToken, getUsers);
adminRouter.get("/user", authenticateToken, getUser);
adminRouter.delete("/images/delete/:_id", authenticateToken, deleteImage);
adminRouter.delete("/users/delete/:id", authenticateToken, deleteUser);
adminRouter.put("/users/update/:id", authenticateToken, updateUser);

export { adminRouter };
