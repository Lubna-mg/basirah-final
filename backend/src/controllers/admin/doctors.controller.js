import Doctor from "../../models/Doctor.js";

export const getDoctors = async (req, res) => {
  const doctors = await Doctor.find().sort({ createdAt: -1 });
  res.json({ doctors });
};

export const createDoctor = async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.json(doctor);
};

export const updateDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(doctor);
};

export const deleteDoctor = async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
