import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Doctor from "../../models/Doctor.js";

const router = express.Router();

/* ======================
   Helpers
====================== */
const generateToken = (id) =>
  jwt.sign({ id, role: "DOCTOR" }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});


/* ======================
   @route   POST /api/v1/doctor/auth/register
   @desc    Register doctor
====================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
      return res.status(400).json({
        message: "Doctor already exists",
      });
    }

    // ❗ لا تشفير هنا
    // التشفير يتم تلقائيًا في Doctor model (pre save)
    const doctor = await Doctor.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      token: generateToken(doctor._id),
    });
  } catch (error) {
    console.error("Register doctor error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

/* ======================
   @route   POST /api/v1/doctor/auth/login
   @desc    Login doctor
====================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      token: generateToken(doctor._id),
    });
  } catch (error) {
    console.error("Login doctor error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
