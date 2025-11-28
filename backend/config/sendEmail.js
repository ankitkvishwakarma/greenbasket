import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("🚀 Using SMTP CONFIG:");
    console.log("EMAIL:", process.env.EMAIL_USER);
    console.log("PORT:", process.env.EMAIL_PORT);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to,
      subject,
      html
    });

    console.log("📩 Email sent:", info.messageId);
    return true;

  } catch (err) {
    console.error("📛 Email send error:", err.message);
    return false;
  }
}
