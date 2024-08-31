import jwt from "jsonwebtoken";
import { csrfToken } from "../controllers/authControllers.js";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const csrfT = req.headers["csrf-token"];
  if (authHeader && csrfToken === csrfT) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

export { authenticateToken };
