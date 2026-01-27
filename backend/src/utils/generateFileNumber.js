// backend/src/utils/generateFileNumber.js
export const generateFileNumber = async (Patient, centerId) => {
  try {
    const count = await Patient.countDocuments({ center: centerId });

    const safeCount = Number.isFinite(count) ? count : 0;

    return `CTR-${String(safeCount + 1).padStart(4, "0")}`;
  } catch (err) {
    console.error("❌ generateFileNumber error:", err);
    throw new Error("FAILED_TO_GENERATE_FILE_NUMBER");
  }
};
