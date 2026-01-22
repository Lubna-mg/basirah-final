// src/controllers/admin/settings.controller.js
import Admin from "../../models/Admin.js";  // تأكد من أنك تستخدم موديل الأدمن بشكل صحيح

// دالة جلب الإعدادات
export const getSettings = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId); // استخدام ID الأدمن المستخرج من التوكن
    if (!admin) {
      return res.status(404).json({ message: "الأدمن غير موجود" });
    }

    // إرجاع الإعدادات
    res.json({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
    });
  } catch (err) {
    console.error("getSettings error:", err);
    res.status(500).json({ message: "فشل في جلب الإعدادات" });
  }
};

// دالة لتحديث إعدادات الأدمن
export const updateSettings = async (req, res) => {
  try {
    const { name, email, phone } = req.body;  // البيانات التي نريد تحديثها

    const admin = await Admin.findById(req.adminId);  // الحصول على البيانات باستخدام id الأدمن من التوكن
    if (!admin) {
      return res.status(404).json({ message: "الأدمن غير موجود" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (phone) admin.phone = phone;

    await admin.save(); // حفظ التغييرات في قاعدة البيانات

    res.json({ message: "تم تحديث البيانات بنجاح", admin });
  } catch (err) {
    console.error("updateSettings error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث البيانات" });
  }
};
