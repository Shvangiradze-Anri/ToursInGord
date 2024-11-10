import express from "express";
import cors from "cors";

const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: "toursingord.netlify.app",
  })
);
//toursingord.netlify.app

https: router.post("/subscribers", async (req, res, next) => {
  const { subscribers } = await import("../controllers/authControllers.js");
  subscribers(req, res, next);
});

router.post("/Authorization/Registration", async (req, res, next) => {
  const { registration } = await import("../controllers/authControllers.js");
  registration(req, res, next);
});

router.post(
  "/Authorization/Registration/ConfrimCode",
  async (req, res, next) => {
    const { CodeSender } = await import("../controllers/codeSender.js");
    CodeSender(req, res, next);
  }
);

router.get("/tourimages", async (req, res, next) => {
  const { getTourImages } = await import("../controllers/adminControler.js");
  getTourImages(req, res, next);
});

router.get("/galleryimages", async (req, res, next) => {
  const { getGalleryImages } = await import("../controllers/adminControler.js");
  getGalleryImages(req, res, next);
});

router.get("/hotelimages", async (req, res, next) => {
  const { getHotelImages } = await import("../controllers/adminControler.js");
  getHotelImages(req, res, next);
});

router.post("/Authorization", async (req, res, next) => {
  const { logIn } = await import("../controllers/authControllers.js");
  logIn(req, res, next);
});

router.post("/logout", async (req, res, next) => {
  const { logOut } = await import("../controllers/authControllers.js");
  logOut(req, res, next);
});

router.put(
  "/Authorization/Change_Password/New_Password",
  async (req, res, next) => {
    const { newPassword } = await import("../controllers/authControllers.js");
    newPassword(req, res, next);
  }
);

router.post("/refresh", async (req, res, next) => {
  const { authenticateRefreshToken } = await import(
    "../middlewares/authenticateRefreshToken.js"
  );
  const { refreshToken } = await import("../middlewares/refreshToken.js");

  authenticateRefreshToken(req, res, async () => {
    refreshToken(req, res, next);
  });
});

router.put("/users/update/image/:email", async (req, res, next) => {
  const { authenticateToken } = await import(
    "../middlewares/authenticateToken.js"
  );
  const { uploadImagesByUser } = await import(
    "../controllers/authControllers.js"
  );

  authenticateToken(req, res, async () => {
    uploadImagesByUser(req, res, next);
  });
});

export { router };
