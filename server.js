
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/docspot")
.then(async () => {
  console.log("MongoDB Connected");
  // ensure default admin
  const User = require("./models/User");
  const bcrypt = require("bcryptjs");
  const adminEmail = "admin@docspot.com";
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({ name: "Administrator", email: adminEmail, password: hashed, role: "admin" });
    console.log("Default admin created: admin@docspot.com / admin123");
  }
})
.catch(err => console.log(err));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
