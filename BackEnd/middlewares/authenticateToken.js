import jwt from "jsonwebtoken";
import { csrfToken } from "./refreshToken.js";

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessT;
  const csrfT = req.cookies.csrfT;
  // console.log("Access Token from Cookies:", token);
  // let counter = 0;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  if (csrfT !== csrfToken) {
    return res.status(401).json("You are not ablle to access on platform");
  }
  // Check if CSRF token matches
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.error("JWT Error:", err);
        return res.status(403).json("Token is not valid!sdnaldajldla");
      }
      // console.log(`get User  ${(counter = counter + 1)} : `, (req.user = user));

      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

export { authenticateToken };
