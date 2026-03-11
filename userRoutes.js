
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// register endpoint can handle patients and doctors via role field
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, specialization, experience, fees } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: role || "patient" });
    await user.save();

    // if registering doctor, also create doctor profile (unapproved by default)
    if (role === "doctor") {
      const Doctor = require("../models/Doctor");
      const doctor = new Doctor({
        userId: user._id,
        name,
        specialization,
        experience,
        fees,
        approved: false
      });
      await doctor.save();
    }

    res.json({ message: "User Registered Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Registration error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "24h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
});


// get current user info
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, async (req, res) => {
  const user = req.user;
  // omit password
  delete user.password;
  res.json(user);
});

module.exports = router;
