import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export const reseedSuperAdmin = async (req, res) => {
  try {
    const seedSecret = req.headers["x-seed-secret"];

    if (!seedSecret || seedSecret !== process.env.SEED_SECRET) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 🧹 تنظيف كامل (للتطوير فقط)
    await Admin.deleteMany({});

    const email = process.env.SUPER_ADMIN_EMAIL.trim().toLowerCase();
    const password = process.env.SUPER_ADMIN_PASSWORD;

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      name: "Super Admin",
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    });

    return res.json({
      message: "Super admin reseeded successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Reseed error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
