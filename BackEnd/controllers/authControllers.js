import jwt from "jsonwebtoken";

import { User } from "../models/user.js";
import { Subscriber } from "../models/subscribers.js";
import { hashePassword, comparedassword } from "../helpers/hashpass.js";
import { cloudinary } from "../utils/cloudinary.js";
import CryptoJS from "crypto-js";
import refreshTokens from "../middlewares/refershtokens.js";
import { csrfToken } from "../middlewares/refreshToken.js";

const subscribers = async (req, res) => {
  try {
    const { sendEmail } = req.body;
    const exist = await Subscriber.findOne({ email: sendEmail });
    if (exist) {
      return res.json({ error: "Email is already exist" });
    }

    const subscriber = await Subscriber.create({
      email: sendEmail,
    });

    res.json(subscriber);
  } catch (error) {
    console.log(error);
  }
};

const registration = async (req, res) => {
  const decryptData = (encryptedSignData, signSecretKey) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedSignData, signSecretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      return res.json({ error: "data can't be decrypted" });
    }
  };
  try {
    const { encryptedSignData, signSecretKey } = req.body;
    const { name, lastname, email, password, gender, birthday } = decryptData(
      encryptedSignData,
      signSecretKey
    );

    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({ error: "Email is already registered" });
    }

    const hashedPassword = await hashePassword(password);

    const user = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      image: { public_id: "", url: "" },
      gender,
      birthday,
      role: "user",
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

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

const logIn = async (req, res) => {
  const decryptData = (encryptedData, secretKey) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    } catch (error) {
      return null; // Instead of sending response here, return null
    }
  };

  try {
    const { secretKey, encryptedData } = req.body;
    const decryptedData = decryptData(encryptedData, secretKey);

    if (!decryptedData) {
      return res.json({ error: "Data can't be decrypted" });
    }

    const { email, password } = decryptedData;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "User not found",
      });
    }

    const match = await comparedassword(password, user.password);
    if (match) {
      const accessT = createAccessToken(user);
      const refreshT = createRefreshToken(user);
      refreshTokens.push(refreshT);

      return res
        .cookie("accessT", accessT, {
          httpOnly: true,
          secure: true, // Enable only for HTTPS
          sameSite: "lax", // Adjust based on your requirements
          domain: "toursingord.netlify.app",
          path: "/",
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        })
        .cookie("refreshT", refreshT, {
          httpOnly: true,
          secure: true, // Enable only for HTTPS
          sameSite: "lax", // Adjust based on your requirements
          domain: "toursingord.netlify.app",
          path: "/",
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        })
        .cookie("csrfT", csrfToken, {
          httpOnly: true,
          secure: true, // Enable only for HTTPS
          sameSite: "lax", // Adjust based on your requirements
          domain: "toursingord.netlify.app",
          path: "/",
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        })
        .json({ expDate: Date.now() + 50 * 1000 });
    }

    return res.json({ error: "Wrong password" }); // Use return to avoid further execution
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" }); // Use return to avoid further execution
  }
};
const logOut = (req, res) => {
  return res
    .clearCookie("accessT", {
      httpOnly: true,
      secure: true, // Enable only for HTTPS
      sameSite: "lax", // Adjust based on your requirements
      domain: "toursingord.netlify.app",
      path: "/",
    })
    .clearCookie("refreshT", {
      httpOnly: true,
      secure: true, // Enable only for HTTPS
      sameSite: "lax", // Adjust based on your requirements
      domain: "toursingord.netlify.app",
      path: "/",
    })
    .clearCookie("csrfT", {
      httpOnly: true,
      secure: true, // Enable only for HTTPS
      sameSite: "lax", // Adjust based on your requirements
      domain: "toursingord.netlify.app",
      path: "/",
    })
    .json({ expDate: undefined });
};
const newPassword = async (req, res) => {
  const decryptData = (encryptedData, codeSecretKey) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, codeSecretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      throw new Error("Data decryption failed");
    }
  };
  try {
    const { encryptedData, codeSecretKey } = req.body;
    const { password, email } = decryptData(encryptedData, codeSecretKey);

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const hashedPassword = await hashePassword(password);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: "Password changed",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const uploadImagesByUser = async (req, res) => {
  const { userImage } = req.body;
  console.log(userImage);
  try {
    // Find the user by email

    const user = await User.findOne({ email: req.params.email });
    console.log(user);

    if (user && userImage) {
      // Upload image to Cloudinary
      if (user.image.public_id) {
        cloudinary.uploader.destroy(user.image.public_id);
      }
      const cloudRes = await cloudinary.uploader.upload(userImage, {
        upload_preset: "site_images_preset",
      });
      console.log(cloudRes);

      if (cloudRes) {
        // Update the user's image state in MongoDB
        user.image = cloudRes;
        const newUser = await user.save(); // Save the updated user object

        const newAccessToken = createAccessToken(newUser);
        const newRefreshToken = createRefreshToken(newUser);
        refreshTokens.push(newRefreshToken);

        const domain = "toursingord.netlify.app";

        return res
          .cookie("accessT", newAccessToken, {
            httpOnly: true,
            secure: true, // Enable only for HTTPS
            sameSite: "lax", // Adjust based on your requirements
            domain: domain,
            path: "/",
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          })
          .cookie("refreshT", newRefreshToken, {
            httpOnly: true,
            secure: true, // Enable only for HTTPS
            sameSite: "lax", // Adjust based on your requirements
            domain: domain,
            path: "/",
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          })
          .json(expDate)
          .send("Image updated");
      } else {
        return res.status(404).send("User not found or no image provided");
      }
    } else {
      return res.status(404).send("User not found or no image provided");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

export {
  subscribers,
  registration,
  logIn,
  newPassword,
  uploadImagesByUser,
  logOut,
};
