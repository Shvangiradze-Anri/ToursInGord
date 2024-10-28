import jwt from "jsonwebtoken";
import refreshTokens from "./refershtokens.js";

const createAccessToken = (user) => {
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      image: user.image,
      lastname: user.lastname,
      gender: user.gender,
      birthday: user.birthday,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "50s" }
  );
};
const createRefreshToken = (user) => {
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      image: user.image,
      lastname: user.lastname,
      gender: user.gender,
      birthday: user.birthday,
      role: user.role,
    },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: "30d" }
  );
};

export let csrfToken = crypto.randomUUID();
const refreshToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshT;
    const csrfT = req.cookies.csrfT;

    if (!refreshToken) return res.status(401).json("You are not authenticated");
    // if (csrfT !== csrfToken) {
    //   return res.status(401).json("You are not ablle to access on platform");
    // }
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not validaaaaaa");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Internal server erroreeeeee" });
      }
      // Create new access and refresh tokens
      const newAccessToken = createAccessToken(user);
      const newRefreshToken = createRefreshToken(user);

      refreshTokens.push(newRefreshToken);

      return res
        .cookie("accessT", newAccessToken, {
          httpOnly: false, // Make cookies HTTP only
          secure: false, // Enable for HTTPS in production
          sameSite: "lax", // Adjust based on your requirements
          domain: "toursingord.netlify.app",
          path: "/",
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Set expiration for 90 days
        })
        .cookie("refreshT", newRefreshToken, {
          httpOnly: false,
          secure: false,
          sameSite: "lax",
          domain: "toursingord.netlify.app",
          path: "/",
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        })
        .cookie("csrfT", csrfToken, {
          httpOnly: false,
          secure: false, // Enable only for HTTPS
          sameSite: "lax", // Adjust based on your requirements
          domain: "toursingord.netlify.app",
          path: "/",
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        })
        .json({ expDate: Date.now() + 50 * 1000 });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server erroraaaaa" });
  }
};
export { refreshToken, refreshTokens };
