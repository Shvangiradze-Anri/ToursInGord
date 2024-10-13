// queue.js
import Queue from "bull";
import { Email } from "./emailService"; // We'll define the email function later

const emailQueue = new Queue("email");

// Process email jobs
emailQueue.process(async (job) => {
  const { emailOptions } = job.data;
  try {
    await Email(emailOptions); // Call the email service
  } catch (error) {
    console.error("Error sending email:", error);
  }
});

export { emailQueue };
