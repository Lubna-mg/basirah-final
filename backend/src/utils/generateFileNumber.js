// src/utils/generateFileNumber.js
export const generateFileNumber = async (Patient, centerId) => {
  const count = await Patient.countDocuments({ center: centerId });
  return `CTR-${String(count + 1).padStart(4, "0")}`;
};
