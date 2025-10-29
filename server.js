const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 4001;

// Configure CORS for your Render domain
app.use(cors({
  origin: '*', // In production, replace with your actual frontend domain
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.static("public")); // serves index.html, css, etc.

// Temporary storage for OTPs
let otpStorage = {};

// ✅ Route to send OTP
app.post("/api/otp/send", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStorage[email] = otp;

  // Configure mail transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "vaaimaiyevellumm@gmail.com",
      pass: process.env.EMAIL_PASS || "kuiv afpv bwbb liyu",
    },
  });

  const mailOptions = {
    from: "Dark Squad Access <yourgmail@gmail.com>",
    to: email,
    subject: "Your OTP for Dark Squad Access",
    text: `Your OTP is ${otp}. It expires in 2 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP ${otp} sent to ${email}`);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ✅ Route to verify OTP
app.post("/api/otp/verify", (req, res) => {
  const { email, otp } = req.body;
  if (otpStorage[email] && otpStorage[email].toString() === otp.toString()) {
    delete otpStorage[email]; // clear after use
    res.json({ message: "Access Granted" });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running fine ✅" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
