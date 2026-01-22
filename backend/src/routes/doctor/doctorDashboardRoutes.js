import express from "express";
import doctorAuth from "../../middleware/doctorAuth.js";
import Test from "../../models/Test.js";
import Patient from "../../models/Patient.js";

const router = express.Router();

router.get("/dashboard", doctorAuth, async (req, res) => {
  try {
    const doctorId = req.doctor._id;

    const patientsCount = await Patient.countDocuments({
      doctor: doctorId,
    });

    const tests = await Test.find({ doctor: doctorId });

    const completedTests = tests.filter(
      (t) => t.status === "completed"
    ).length;

    const notesCount = tests.reduce(
      (acc, t) => acc + (t.notes?.length || 0),
      0
    );

    res.json({
      patientsCount,
      completedTests,
      notesCount,
      recentTests: tests.slice(0, 5),
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Dashboard error" });
  }
});

export default router;
