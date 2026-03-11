
const express = require("express");
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// book new appointment (patient only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "patient") return res.status(403).json({ message: "Only patients can book" });
    const { doctorId, date, time, document } = req.body;
    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: "Doctor, date, and time are required" });
    }
    const appointment = new Appointment({
      patientId: req.user._id,
      doctorId,
      date,
      time,
      document,
      status: "Booked"
    });
    await appointment.save();
    res.json({ message: "Appointment Booked Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Booking error" });
  }
});

// get appointments for logged-in user or all (admin)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "patient") {
      query.patientId = req.user._id;
    } else if (req.user.role === "doctor") {
      // find doctor record linked to user
      const doctor = await require("../models/Doctor").findOne({ userId: req.user._id });
      if (!doctor) return res.status(400).json({ message: "Doctor profile not found" });
      query.doctorId = doctor._id;
    }
    // admin gets everything
    const appointments = await Appointment.find(query).populate("doctorId patientId");
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

// doctor or admin can update status
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    if (req.user.role === "doctor") {
      const doctor = await require("../models/Doctor").findOne({ userId: req.user._id });
      if (!doctor || appt.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({ message: "Not your appointment" });
      }
    }
    // patients cannot change status via this endpoint
    appt.status = status;
    await appt.save();
    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
});

// patient can reschedule (change date/time) if booked
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { date, time } = req.body;
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    if (req.user.role !== "patient" || appt.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (appt.status !== "Booked") {
      return res.status(400).json({ message: "Cannot reschedule after status changed" });
    }
    appt.date = date || appt.date;
    appt.time = time || appt.time;
    await appt.save();
    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rescheduling" });
  }
});

module.exports = router;
