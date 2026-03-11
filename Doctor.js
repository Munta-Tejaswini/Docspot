
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  specialization: String,
  experience: Number,
  fees: Number,
  approved: { type: Boolean, default: false }
});

module.exports = mongoose.model("Doctor", doctorSchema);
