import express from "express";
import cors from "cors";
import {
  subscribers,
  registration,
  logIn,
  newPassword,
  refreshToken,
  uploadImagesByUser,
} from "../controllers/authControllers.js";

import { CodeSender } from "../controllers/codeSender.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.post("/subscribers", subscribers);
router.post("/Authorization/Registration", registration);
router.post("/Authorization/Registration/ConfrimCode", CodeSender);
router.post("/Authorization", logIn);
router.put("/Authorization/Change_Password/New_Password", newPassword);
router.post("/refresh", refreshToken);
router.put("/users/update/image/:email", authenticateToken, uploadImagesByUser);

export { router };
