import { Images } from "../models/ImagesData.js";
import { User } from "../models/user.js";
import { cloudinary } from "../utils/cloudinary.js";
import { hashePassword } from "../helpers/hashpass.js";
import CryptoJS from "crypto-js";

const uploadImages = async (req, res) => {
  try {
    const { image, page } = req.body;

    const images = await Images.find({ url: image });

    if (images) {
      const cloudRes = await cloudinary.uploader.upload(image, {
        upload_preset: "site_images_preset",
      });
      if (cloudRes) {
        const Image = new Images({
          image: {
            public_id: cloudRes.public_id,
            url: cloudRes.secure_url,
          },
          page,
        });
        const saveImage = await Image.save();

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "public, max-age=7776000000");

        res.status(200).send(saveImage);
      }
    }
  } catch (error) {
    if (error.message && error.message.includes("request entity too large")) {
      return res.status(413).send({
        error: "Image size is large.",
      });
    }
    res.status(500).send({
      error: "An error occurred while uploading the image. Please try again.",
    });
  }
};

let cachedImages = null;
const CACHE_DURATION_MS = 7776000000;
let cacheTimestamp = null;

const listenForChanges = () => {
  const changeStream = Images.watch();

  changeStream.on("change", async (change) => {
    try {
      invalidateCache();
      console.log("changeeeeed");
    } catch (error) {
      console.log(error);
    }
  });
};

const getImages = async (req, res) => {
  try {
    const currentTime = Date.now();

    // Check if cache is valid
    if (cachedImages && currentTime - cacheTimestamp < CACHE_DURATION_MS) {
      return res.json(cachedImages);
    }

    // Fetch images from database
    const images = await Images.find();
    updateCache(images);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=7776000000");

    res.json(images);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const updateCache = (images) => {
  cachedImages = images;
  cacheTimestamp = Date.now();
};

const invalidateCache = () => {
  cachedImages = null;
  cacheTimestamp = null;
};

listenForChanges();

const deleteImage = async (req, res) => {
  try {
    console.log(req.params); // Should show _id
    const image = await Images.findById(req.params._id);
    if (!image) return res.status(404).send("Image not found");

    const publicId = image.image.public_id;
    const destroyResponse = await cloudinary.uploader.destroy(publicId);

    if (destroyResponse.result === "ok") {
      const deleteImageDb = await Images.findOneAndDelete({
        _id: req.params._id,
      });
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

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleteUserDB = await User.findByIdAndDelete(req.params.id);

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

    return res.json(updatedUser);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating user" });
  }
};

export {
  uploadImages,
  getImages,
  getUsers,
  deleteImage,
  deleteUser,
  updateUser,
};
