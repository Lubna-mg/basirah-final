import mongoose from "mongoose";

export const generateFileNumber = async (Patient, centerId) => {
  const lastPatient = await Patient.findOne({ center: centerId })
    .sort({ createdAt: -1 })
    .select("file_number");

  if (!lastPatient || !lastPatient.file_number) {
    return "CTR-0001";
  }

  const lastNumber = parseInt(
    lastPatient.file_number.replace("CTR-", ""),
    10
  );

  return `CTR-${String(lastNumber + 1).padStart(4, "0")}`;
};
