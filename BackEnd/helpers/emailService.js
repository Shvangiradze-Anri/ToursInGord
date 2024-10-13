// emailService.js
import sgMail from "@sendgrid/mail";

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Email = async (options) => {
  const msg = {
    to: options.to,
    from: "your_email@example.com", // Verified SendGrid sender email
    subject: options.subject,
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export { Email };
