import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";


const router = express.Router();

// Generate JWT token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWTSECRET, {
    expiresIn: "7d",
  });
};

// Sign Up
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already in use" });

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = createToken(newUser._id);
    res.status(201).json({ token, username: newUser.username });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user._id);
    res.status(200).json({ token, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

router.get("/me", verifyToken, (req, res) => {
  res.json(req.user);
});

export default router;
