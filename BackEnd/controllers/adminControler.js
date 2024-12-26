import { Galleryimage, Hotelimage, Tourimage } from "../models/ImagesData.js";
import { User } from "../models/user.js";
import { cloudinary } from "../utils/cloudinary.js";
import { hashePassword } from "../helpers/hashpass.js";
import CryptoJS from "crypto-js";
import { createClient } from "@redis/client";
import redisClient from "../server.js";

const uploadImages = async (req, res) => {
  try {
    const { image, page } = req.body;
    let ImageModel;
    if (page === "tour") {
      ImageModel = Tourimage;
    } else if (page === "gallery") {
      ImageModel = Galleryimage;
    } else if (page === "hotel") {
      ImageModel = Hotelimage;
    } else {
      return res.status(400).json({ error: "Invalid page value" });
    }
    const cloudRes = await cloudinary.uploader.upload(image, {
      upload_preset: "site_images_preset",
    });

    if (cloudRes) {
      const newImage = new ImageModel({
        image: {
          public_id: cloudRes.public_id,
          url: cloudRes.secure_url,
        },
        page,
      });
      const savedImage = await newImage.save();
      await redisClient.del(page);

      return res.status(200).send(savedImage);
    } else {
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }
  } catch (error) {
    if (error.message && error.message.includes("request entity too large")) {
      return res.status(413).json({
        error: "Image size is too large.",
      });
    }
    console.error("Error during image upload:", error);
    res.status(500).json({
      error: "An error occurred while uploading the image. Please try again.",
    });
  }
};

const getTourImages = async (req, res) => {
  try {
    const startTime = Date.now();
    const cachedImages = await redisClient.get("tour");

    if (cachedImages) {
      console.log(`Redis Fetch Time: ${Date.now() - startTime}ms`);
      return res.json(JSON.parse(cachedImages));
    }

    console.log("Cache miss: Querying MongoDB");
    const images = await Tourimage.find();
    await redisClient.setEx("tour", 1209600, JSON.stringify(images));

    console.log("Cache updated: Data stored in Redis");
    res.json(images);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getGalleryImages = async (req, res) => {
  try {
    const startTime = Date.now();
    const cachedImages = await redisClient.get("gallery");

    if (cachedImages) {
      console.log(`Redis Fetch Time: ${Date.now() - startTime}ms`);
      return res.json(JSON.parse(cachedImages));
    }
    console.log("Cache miss: Querying MongoDB");
    const images = await Galleryimage.find();
    await redisClient.setEx("gallery", 1209600, JSON.stringify(images));

    console.log("Cache updated: Data stored in Redis");
    res.json(images);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getHotelImages = async (req, res) => {
  try {
    const startTime = Date.now();
    const cachedImages = await redisClient.get("hotel");

    if (cachedImages) {
      console.log(`Redis Fetch Time: ${Date.now() - startTime}ms`);
      return res.json(JSON.parse(cachedImages));
    }
    console.log("Cache miss: Querying MongoDB");
    const images = await Hotelimage.find();
    await redisClient.setEx("hotel", 1209600, JSON.stringify(images));

    console.log("Cache updated: Data stored in Redis");
    res.json(images);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteImage = async (req, res) => {
  try {
    const { page } = req.query;
    console.log(page);

    if (page) {
      let deleteImageDb;
      if (page === "tour") {
        const image = await Tourimage.findById(req.params._id);
        if (!image) return res.status(404).send("Image not found");

        const destroyResponse = await cloudinary.uploader.destroy(
          image.image.public_id
        );
        if (destroyResponse)
          deleteImageDb = await Tourimage.findByIdAndDelete(req.params._id);
      } else if (page === "gallery") {
        const image = await Galleryimage.findById(req.params._id);
        if (!image) return res.status(404).send("Image not found");

        const destroyResponse = await cloudinary.uploader.destroy(
          image.image.public_id
        );
        if (destroyResponse)
          deleteImageDb = await Galleryimage.findByIdAndDelete(req.params._id);
      } else if (page === "hotel") {
        const image = await Hotelimage.findById(req.params._id);
        if (!image) return res.status(404).send("Image not found");

        const destroyResponse = await cloudinary.uploader.destroy(
          image.image.public_id
        );
        if (destroyResponse)
          deleteImageDb = await Hotelimage.findByIdAndDelete(req.params._id);
      } else {
        return res.status(400).send("Invalid page type");
      }

      if (!deleteImageDb) {
        return res
          .status(404)
          .send("Image not found in the specified collection");
      }
      await redisClient.del(page);
      res.status(200).send(deleteImageDb);
    } else {
      console.log("Failed to delete image from Cloudinary");
      res.status(500).send("Failed to delete image from Cloudinary");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).send("An error occurred");
  }
};

const adminusers = async (req, res) => {
  try {
    const cachedAdminUser = await redisClient.get("adminusers");

    if (!req.user) {
      return res.send("You are not authenticated");
    }
    if (cachedAdminUser) {
      console.log("Returning cached users");
      return res.json(JSON.parse(cachedAdminUser));
    } else {
      const users = await User.find().select("-password");

      await redisClient.setEx("adminusers", 1209600, JSON.stringify(users));
      console.log(users);
      return res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const cachedUser = await redisClient.get("user");
    if (cachedUser) {
      return res.json(JSON.parse(cachedUser));
    } else {
      await redisClient.setEx("user", 1209600, JSON.stringify(user));

      res.status(200).send(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleteUserDB = await User.findByIdAndDelete(req.params.id);
    await Promise.all([redisClient.del("adminusers"), redisClient.del("user")]);
    res.status(200).send(deleteUserDB);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateUser = async (req, res) => {
  const decryptData = (encryptedEditData, editSecretKey) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedEditData, editSecretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      return res.json({ error: "data can't be decrypted" });
    }
  };

  try {
    const { encryptedEditData, editSecretKey } = req.body;
    const { name, lastname, email, password, image, gender, birthday, role } =
      decryptData(encryptedEditData, editSecretKey);

    // Retrieve current user data to check for existing image
    const currentUser = await User.findById(req.params.id);
    let user = {};

    if (name !== "") user.name = name;
    if (lastname !== "") user.lastname = lastname;
    if (email !== "") user.email = email;
    if (gender !== "") user.gender = gender;
    if (birthday !== "") user.birthday = birthday;
    if (role !== "") user.role = role;

    if (password !== "") {
      const hashedPassword = await hashePassword(password);
      user.password = hashedPassword;
    }

    // Delete current image from Cloudinary if it exists and a new image is provided
    if (image !== "" && currentUser.image && currentUser.image.public_id) {
      await cloudinary.uploader.destroy(currentUser.image.public_id);
    }

    // Upload new image if provided
    if (image !== "") {
      const cloudRes = await cloudinary.uploader.upload(image, {
        upload_preset: "site_images_preset",
      });
      user.image = {
        url: cloudRes.secure_url,
        public_id: cloudRes.public_id,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, user, {
      new: true,
    });
    await Promise.all([redisClient.del("adminusers"), redisClient.del("user")]);

    return res.json(updatedUser);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating user" });
  }
};

export {
  getTourImages,
  getGalleryImages,
  getHotelImages,
  uploadImages,
  adminusers,
  getUser,
  deleteImage,
  deleteUser,
  updateUser,
};
