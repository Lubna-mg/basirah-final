import Center from "../../models/Center.js";

/**
 * GET /api/v1/center/me
 * جلب بيانات المركز الحالي
 */
export const getMyCenter = async (req, res) => {
  try {
    const center = await Center.findById(req.centerId).select("-password");

    if (!center) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }

    res.json(center);
  } catch (error) {
    console.error("getMyCenter error:", error);
    res.status(500).json({ message: "فشل جلب بيانات المركز" });
  }
};

/**
 * PUT /api/v1/center/me
 * تحديث بيانات المركز
 */
export const updateMyCenter = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "city",
      "address",
      "contactEmail",
      "contactPhone",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // تحقق من البريد الإلكتروني إذا كان مدخلًا
    if (updates.contactEmail && !isValidEmail(updates.contactEmail)) {
      return res.status(400).json({ message: "البريد الإلكتروني غير صالح" });
    }

    const center = await Center.findByIdAndUpdate(
      req.centerId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!center) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }

    res.json({
      message: "تم تحديث بيانات المركز بنجاح",
      center,
    });
  } catch (error) {
    console.error("updateMyCenter error:", error);
    res.status(500).json({ message: "فشل تحديث بيانات المركز" });
  }
};

// دالة للتحقق من صحة البريد الإلكتروني
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
