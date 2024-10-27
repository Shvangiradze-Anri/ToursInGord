import express from "express";
import cors from "cors";
import {
  subscribers,
  registration,
  logIn,
  newPassword,
  uploadImagesByUser,
  logOut,
} from "../controllers/authControllers.js";

import { CodeSender } from "../controllers/codeSender.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authenticateRefreshToken } from "../middlewares/authenticateRefreshToken.js";
import { refreshToken } from "../middlewares/refreshToken.js";

const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: "https://toursingord.netlify.app",
  })
);

router.post("/subscribers", subscribers);
router.post("/Authorization/Registration", registration);
router.post("/Authorization/Registration/ConfrimCode", CodeSender);
router.post("/Authorization", logIn);
router.post("/logout", logOut);
router.put("/Authorization/Change_Password/New_Password", newPassword);
router.post("/refresh", authenticateRefreshToken, refreshToken);
router.put("/users/update/image/:email", authenticateToken, uploadImagesByUser);

export { router };
