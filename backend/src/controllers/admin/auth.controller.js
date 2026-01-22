// src/controllers/admin/auth.controller.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AdminUser from "../../models/Admin.js";

function signAdminToken(admin) {
  return jwt.sign(
    { id: admin._id, role: "admin", email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await AdminUser.findOne({
      email: email?.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signAdminToken(admin);

    return res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role || "Admin",
      },
    });
  } catch (err) {
    console.error("loginAdmin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
