import nodemailer from "nodemailer";
import CryptoJS from "crypto-js";
import { User } from "../models/user.js";

const Email = (options, callback) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ADMIN,
      pass: process.env.PASSWORD,
    },
  });

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
      return callback(err); // Pass the error to callback for further handling
    }
    console.log("Email sent: " + info.response);
    callback(null, info); // Email was successfully sent
  });
};

const decryptData = (encryptedData, codeSecretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, codeSecretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    return null;
  }
};

const CodeSender = async (req, res) => {
  const { encryptedData, codeSecretKey } = req.body;

  try {
    const decryptedData = decryptData(encryptedData, codeSecretKey);
    if (!decryptedData) {
      return res.status(400).send("Failed to decrypt data");
    }

    const { defaultNumber, email } = decryptedData;
    console.log(email, defaultNumber);

    const user = await User.findOne({ email });
    console.log("user", user);

    if (!defaultNumber || !email) {
      return res
        .status(400)
        .send("Decrypted data does not contain expected properties");
    } else if (user && user.email === email && req.path == "/registration") {
      return res.status(400).send("Email already exists");
    }

    let options = {
      from: `mayHost 🛍️`,
      to: email,
      subject: "Message From Henrys_Dev",
      html: `<div>Code: <b>${defaultNumber}</b></div>`,
    };

    // Call Email with error handling
    Email(options, (err, info) => {
      if (err) {
        return res.status(500).send("Failed to send email");
      }
      res.status(200).send("Code sent");
    });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).send("Error processing data");
  }
};

export { CodeSender };
