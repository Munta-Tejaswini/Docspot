const express = require("express");
const Doctor = require("../models/Doctor");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// public list of only approved doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({ approved: true });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// admin: get all doctors including unapproved
router.get("/all", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// admin: approve a doctor
router.patch("/:id/approve", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    const doc = await Doctor.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!doc) return res.status(404).json({ message: "Doctor not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error approving doctor" });
  }
});

// doctors can update their profile
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") return res.status(403).json({ message: "Forbidden" });
    if (!req.doctor || req.doctor._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Not your profile" });
    }
    const updates = req.body;
    const doc = await Doctor.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
