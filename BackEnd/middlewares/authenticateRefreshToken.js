import jwt from "jsonwebtoken";
import tokenStore from "./refershtokens.js";

let counter = 0;
const authenticateRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshT;
  const csrfT = req.cookies.csrfT;

  if (!refreshToken) {
    return res.status(401).json("You are not authenticated");
  }
  // console.log(((counter = counter + 1), "        "));
  // console.log("Refresh Token Received:", refreshToken);
  // console.log("Stored Token for Comparison:", tokenStore.refreshTokens);

  if (tokenStore.refreshTokens !== refreshToken) {
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
      .json({ expDate: undefined });
  }
  if (csrfT !== tokenStore.csrfToken) {
    return res.status(401).json("You are not ablle to access on platform");
  }

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
