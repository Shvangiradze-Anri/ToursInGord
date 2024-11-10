import jwt from "jsonwebtoken";
import tokenStore from "./refershtokens.js";

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
    { expiresIn: "10s" }
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

const refreshToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshT;

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Internal server erroreeeeee" });
      }
      const newAccessToken = createAccessToken(user);
      const newRefreshToken = createRefreshToken(user);

      tokenStore.csrfToken = crypto.randomUUID();
      tokenStore.refreshTokens = newRefreshToken;

      return res
        .cookie("accessT", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          path: "/",
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        })
        .cookie("refreshT", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          path: "/",
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        })
        .cookie("csrfT", tokenStore.csrfToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          path: "/",
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        })
        .json({ expDate: Date.now() + 10 * 1000 });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server erroraaaaa" });
  }
};
export { refreshToken };
