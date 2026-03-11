const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, "secretkey");
    const user = await User.findById(decoded.id).lean();
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    // if doctor, attach doctor record too
    if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: user._id }).lean();
      req.doctor = doctor;
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;