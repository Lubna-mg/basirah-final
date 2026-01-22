import Appointment from "../../models/Appointment.js";

export const getMyAppointments = async (req, res) => {
  try {
    const doctorId = req.doctor._id;

    const appointments = await Appointment.find({
      doctor: doctorId,
    })
      .populate("patient", "name file_number")
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    console.error("getMyAppointments error:", error);
    res.status(500).json({ message: "فشل جلب المواعيد" });
  }
};
