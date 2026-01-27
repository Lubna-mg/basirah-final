// backend/src/utils/generateFileNumber.js
import mongoose from "mongoose";

export const generateFileNumber = async () => {
  const shortId = new mongoose.Types.ObjectId()
    .toString()
    .slice(-6)
    .toUpperCase();

  return `CTR-${shortId}`;
};
