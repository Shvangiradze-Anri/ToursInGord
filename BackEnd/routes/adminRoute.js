import express from "express";
import cors from "cors";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const adminRouter = express.Router();

adminRouter.use(
  cors({
    credentials: true,
    origin: "toursingord.netlify.app",
  })
);

adminRouter.post("/uploadImages", authenticateToken, async (req, res, next) => {
  const { uploadImages } = await import("../controllers/adminControler.js");
  uploadImages(req, res, next);
});

adminRouter.get("/adminusers", authenticateToken, async (req, res, next) => {
  const { adminusers } = await import("../controllers/adminControler.js");
  adminusers(req, res, next);
});

adminRouter.get("/user", authenticateToken, async (req, res, next) => {
  const { getUser } = await import("../controllers/adminControler.js");
  getUser(req, res, next);
});

adminRouter.delete(
  "/images/delete/:_id",
  authenticateToken,
  async (req, res, next) => {
    const { deleteImage } = await import("../controllers/adminControler.js");
    deleteImage(req, res, next);
  }
);

adminRouter.delete(
  "/users/delete/:id",
  authenticateToken,
  async (req, res, next) => {
    const { deleteUser } = await import("../controllers/adminControler.js");
    deleteUser(req, res, next);
  }
);

adminRouter.put(
  "/users/update/:id",
  authenticateToken,
  async (req, res, next) => {
    const { updateUser } = await import("../controllers/adminControler.js");
    updateUser(req, res, next);
  }
);

export { adminRouter };
