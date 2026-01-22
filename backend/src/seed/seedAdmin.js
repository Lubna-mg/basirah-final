import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({
      email: process.env.SEED_ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    await Admin.create({
      name: "Super Admin",
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
    });

    console.log("🚀 Admin seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seed admin failed:", error);
    process.exit(1);
  }
};

seedAdmin();
