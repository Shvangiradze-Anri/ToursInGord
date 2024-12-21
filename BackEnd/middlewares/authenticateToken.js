import jwt from "jsonwebtoken";
import tokenStore from "./refershtokens.js";

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessT;
  const csrfT = req.cookies.csrfT;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  if (csrfT !== tokenStore.csrfToken) {
    return res
      .clearCookie("accessT", {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
      })
      .clearCookie("refreshT", {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
      })
      .clearCookie("csrfT", {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
      })
      .status(401)
      .json({ expDate: undefined });
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.error("JWT Error:", err);
        return res.status(403).json("Token is not valid!sdnaldajldla");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

export { authenticateToken };
