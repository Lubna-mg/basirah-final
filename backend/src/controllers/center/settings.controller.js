import Center from "../../models/Center.js";

/* =====================================================
   GET /api/v1/center/settings
   جلب إعدادات المركز
===================================================== */
export const getSettings = async (req, res) => {
  try {
    if (!req.centerId) {
      return res.status(401).json({ message: "غير مصرح" });
    }

    const center = await Center.findById(req.centerId)
      .select("name email phone city notifications status")
      .lean();

    if (!center) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }

    res.json({
      name: center.name || "",
      email: center.email || "",
      phone: center.phone || "",
      city: center.city || "",
      notifications: center.notifications || {
        reports: true,
        sessions: true,
        payments: true,
        doctors: true,
      },
      status: center.status, // عربي
    });
  } catch (err) {
    console.error("getSettings error:", err);
    res.status(500).json({ message: "فشل في جلب الإعدادات" });
  }
};

/* =====================================================
   PUT /api/v1/center/settings
   تحديث إعدادات المركز
   (بدون لمس status نهائيًا)
===================================================== */
export const updateSettings = async (req, res) => {
  try {
    if (!req.centerId) {
      return res.status(401).json({ message: "غير مصرح" });
    }

    const { name, email, phone, city, notifications } = req.body;

    /* ================= build update object ================= */
    const updateData = {};

    // الاسم
    if (name !== undefined) {
      updateData.name = name;
    }

    // المدينة
    if (city !== undefined) {
      updateData.city = city;
    }

    // رقم الهاتف (تحقق سعودي)
    if (phone !== undefined) {
      if (!isValidSaudiPhone(phone)) {
        return res.status(400).json({ message: "رقم الهاتف غير صالح" });
      }
      updateData.phone = phone;
    }

    // البريد (لو تغيّر فقط)
    if (email) {
      const exists = await Center.findOne({
        email,
        _id: { $ne: req.centerId },
      });

      if (exists) {
        return res
          .status(400)
          .json({ message: "البريد الإلكتروني مستخدم مسبقًا" });
      }

      updateData.email = email;
    }

    // الإشعارات
    if (notifications) {
      updateData.notifications = {
        reports: notifications.reports ?? true,
        sessions: notifications.sessions ?? true,
        payments: notifications.payments ?? true,
        doctors: notifications.doctors ?? true,
      };
    }

    /* ================= update without touching status ================= */
    const updatedCenter = await Center.findByIdAndUpdate(
      req.centerId,
      { $set: updateData },
      {
        new: true,
        runValidators: false, // 🔑 يمنع فشل enum status
      }
    ).select("name email phone city notifications status");

    if (!updatedCenter) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }

    res.json({
      message: "تم تحديث البيانات بنجاح",
      center: updatedCenter,
    });
  } catch (err) {
    console.error("updateSettings error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث البيانات" });
  }
};

/* =====================================================
   Helpers
===================================================== */

// تحقق من رقم جوال سعودي: 05xxxxxxxx
const isValidSaudiPhone = (phone) => {
  const regex = /^(05)[0-9]{8}$/;
  return regex.test(phone);
};
