import jwt from "jsonwebtoken";
import { csrfToken } from "./refreshToken.js";

const authenticateRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshT;
  const csrfT = req.cookies.csrfT;

  if (!refreshToken) {
    return res.status(401).json("You are not authenticated");
  }
  // if (csrfT !== csrfToken) {
  //   return res.status(401).json("You are not ablle to access on platform");
  // }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "authenticateRefreshToken Internal server error" });
    }
    req.user = user;
    next();
  });
};

export { authenticateRefreshToken };
