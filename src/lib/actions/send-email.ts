"use server";
import nodemailer from "nodemailer";
import "dotenv/config"; // Ensures environment variables are loaded

export default async function sendEmail(
  recipientEmail: string,
  subject: string,
  body: string,
  filePath?: string // Optional file attachment (MP4 file)
): Promise<void> {
    try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // Use STARTTLS
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // ✅ Use App Password here
          },
        });
    
        const mailOptions = {
          from: `"User Test" <${process.env.EMAIL_USER}>`,
          to: recipientEmail,
          subject,
          text: body,
          attachments: filePath ? [{ filename: "user-test.mp4", path: filePath }] : [],
        };
    
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.messageId);
      } catch (error) {
        console.error("❌ Failed to send email:", error);
      }
    }