import nodemailer from "nodemailer";
import CryptoJS from "crypto-js";
import { User } from "../models/user.js";

const Email = (options) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ADMIN,
      pass: process.env.PASSWORD,
    },
  });
  transporter.sendMail(options, (err, info) => {
    if (err) {
      return err;
    }
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

    const user = await User.findOne({ email });
    if (!defaultNumber || !email) {
      return res
        .status(400)
        .send("Decrypted data does not contain expected properties");
    } else if (user.email === email) {
      return res.status(400).send("Email  already exist");
    }

    let options = {
      from: `mayHost 🛍️ `,
      to: email,
      subject: "Message From Henrys_Dev",
      html: `
        <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
        <div style="max-width: 700px; background-color: white; margin: 0 auto">
          <div style="width: 100%; background-color: #00efbc; padding: 20px 0">
          <a href="${"https://henrys-web-dev.netlify.app/"}" ><img
              src="https://res.cloudinary.com/dywchsrms/image/upload/v1707414670/Portfolio%20Images/henry_yrgo6e.svg"
              style="width: 100%; height: 70px; object-fit: contain"
            /></a> 
          </div>
          <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
            <p style="font-weight: 800; font-size: 1.2rem; padding: 0 30px">
             Code: <b>${defaultNumber}</b>
            </p> 
          </div>
          <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid; margin-top: 3rem;">
          <p style="font-weight: 600; font-size: 1.1rem; padding: 0 30px">
          Thank you for reaching out!
          Your inquiry has been received and I will do my best to respond to you promptly. Your support and interest in my work truly inspire me to continue pursuing my passion.
          <br></br>
          <br>Best regards</br>
          </p> 
        </div>
        </div>
      </div>
        `,
    };

    Email(options);

    res.status(200).send("code sent");
  } catch (error) {
    res.status(500).send("Error processing data");
  }
};

export { CodeSender };
