import Center from "../../models/Center.js";
import Activity from "../../models/Activity.js";

/* =======================
   جلب جميع المراكز
======================= */
export async function listCenters(req, res) {
  try {
    const centers = await Center.find({}).sort({ createdAt: -1 });

    return res.json({
      centers: centers.map((c) => ({
        id: c._id,
        name: c.name,
        city: c.city,
        address: "-", // غير موجود في الموديل
        contactEmail: c.email,   // 🔥 تحويل من model
        contactPhone: c.phone,   // 🔥 تحويل من model
        subscriptionPlan: "تجريبي", // غير موجود في الموديل الحالي
        subscriptionEndDate: null,
        status: "بانتظار التفعيل",
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    console.error("listCenters error:", err);
    return res.status(500).json({ message: "فشل تحميل المراكز" });
  }
}

/* =======================
   إضافة مركز جديد
======================= */
export async function createCenter(req, res) {
  try {
    const {
      name,
      city,
      contactEmail,
      contactPhone,
    } = req.body;

    // تحقق أساسي
    if (!name || !contactEmail || !contactPhone) {
      return res.status(400).json({
        message: "اسم المركز والبريد الإلكتروني ورقم الهاتف مطلوبة",
      });
    }

    const center = await Center.create({
      name,
      email: contactEmail,   // ✅ مطابق للموديل
      phone: contactPhone,   // ✅ مطابق للموديل
      city,
      notifications: {
        reports: true,
        sessions: true,
        payments: true,
        doctors: true,
      },
    });

    // تسجيل نشاط (غير إجباري)
    try {
      await Activity.create({
        text: `تم إضافة مركز جديد: ${center.name}`,
      });
    } catch (logError) {
      console.warn("Activity log failed (createCenter):", logError.message);
    }

    return res.status(201).json({
      id: center._id,
      name: center.name,
      city: center.city,
      address: "-",
      contactEmail: center.email,
      contactPhone: center.phone,
      subscriptionPlan: "تجريبي",
      subscriptionEndDate: null,
      status: "بانتظار التفعيل",
      createdAt: center.createdAt,
    });
  } catch (err) {
    console.error("createCenter error:", err);
    return res.status(400).json({
      message: err.message,
    });
  }
}

/* =======================
   تعديل مركز
======================= */
export async function updateCenter(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      city,
      contactEmail,
      contactPhone,
    } = req.body;

    const center = await Center.findByIdAndUpdate(
      id,
      {
        name,
        city,
        email: contactEmail,
        phone: contactPhone,
      },
      { new: true, runValidators: true }
    );

    if (!center) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }

    try {
      await Activity.create({
        text: `تم تعديل مركز: ${center.name}`,
      });
    } catch (logError) {
      console.warn("Activity log failed (updateCenter):", logError.message);
    }

    return res.json({
      id: center._id,
      name: center.name,
      city: center.city,
      address: "-",
      contactEmail: center.email,
      contactPhone: center.phone,
      subscriptionPlan: "تجريبي",
      subscriptionEndDate: null,
      status: "بانتظار التفعيل",
      createdAt: center.createdAt,
    });
  } catch (err) {
    console.error("updateCenter error:", err);
    return res.status(500).json({ message: "فشل تحديث المركز" });
  }
}

/* =======================
   حذف مركز
======================= */
export async function deleteCenter(req, res) {
  try {
    const { id } = req.params;

    const center = await Center.findByIdAndDelete(id);
    if (!center) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }

    try {
      await Activity.create({
        text: `تم حذف مركز: ${center.name}`,
      });
    } catch (logError) {
      console.warn("Activity log failed (deleteCenter):", logError.message);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteCenter error:", err);
    return res.status(500).json({ message: "فشل حذف المركز" });
  }
}
