const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../utility/database");
const sgMail = require('@sendgrid/mail');
const SECRET = process.env.JWT_SECRET || "mysecretkey";

const sendGridApiKey = process.env.SENDGRID_API_KEY;
const sendGridSender = process.env.SENDGRID_SENDER || 'nietclg@gmail.com';

if (sendGridApiKey) {
  sgMail.setApiKey(sendGridApiKey);
} else {
  console.warn('Warning: SENDGRID_API_KEY is not set. Email delivery will fail.');
}

if (!process.env.SENDGRID_SENDER) {
  console.warn('Warning: SENDGRID_SENDER is not set. Use a verified sender identity in SendGrid.');
}

// REGISTER API
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to MongoDB
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await newUser.save();

    try {
      if (sendGridApiKey) {
        await sgMail.send({
          to: email,
          from: sendGridSender,
          subject: 'Welcome to authentication app',
          html: `<h4> Welcome to authentication app, ${name}</h4>`,
        });
      } else {
        console.warn('SENDGRID_API_KEY is not configured.');
      }
    } catch (emailErr) {
      console.error('SendGrid email error:', emailErr);
    }

    res.status(201).json({ message: "Registered successfully" });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user in MongoDB
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET PROFILE API
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, SECRET);

    // Find user in MongoDB
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// RESET PASSWORD API
router.post("/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and new password required" });
    }

    // Find user in MongoDB
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in MongoDB
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;