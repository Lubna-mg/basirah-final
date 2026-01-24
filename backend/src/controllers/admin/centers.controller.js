import Center from "../../models/Center.js";
import Activity from "../../models/Activity.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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
        address: "-", // غير مستخدم حاليًا
        contactEmail: c.email,
        contactPhone: c.phone,
        subscriptionPlan: c.subscriptionPlan || "تجريبي",
        subscriptionEndDate: c.subscriptionEndDate || null,
        status: c.status,
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    console.error("listCenters error:", err);
    return res.status(500).json({ message: "فشل تحميل المراكز" });
  }
}

/* =======================
   إضافة مركز جديد (بكلمة مرور تلقائية)
======================= */
export async function createCenter(req, res) {
  try {
    const { name, city, contactEmail, contactPhone } = req.body;

    // تحقق أساسي
    if (!name || !contactEmail || !contactPhone) {
      return res.status(400).json({
        message: "اسم المركز والبريد الإلكتروني ورقم الهاتف مطلوبة",
      });
    }

    // 🔐 توليد كلمة مرور مؤقتة
    const tempPassword = crypto.randomBytes(6).toString("hex");

    // 🔒 تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const center = await Center.create({
      name,
      email: contactEmail,
      phone: contactPhone,
      city,
      password: hashedPassword,      // ✅ الآن موجودة
      mustChangePassword: true,       // ✅ تغييرها أول دخول
      status: "بانتظار التفعيل",
      subscriptionPlan: "تجريبي",
      notifications: {
        reports: true,
        sessions: true,
        payments: true,
        doctors: true,
      },
    });

    // تسجيل نشاط
    try {
      await Activity.create({
        text: `تم إضافة مركز جديد: ${center.name}`,
      });
    } catch (logError) {
      console.warn("Activity log failed (createCenter):", logError.message);
    }

    /**
     * ⚠️ ملاحظة:
     * tempPassword تُرجع مؤقتًا للاختبار فقط
     * في الإنتاج الحقيقي:
     * - تُرسل عبر إيميل
     * - أو رابط تفعيل
     */
    return res.status(201).json({
      id: center._id,
      name: center.name,
      city: center.city,
      address: "-",
      contactEmail: center.email,
      contactPhone: center.phone,
      subscriptionPlan: center.subscriptionPlan,
      subscriptionEndDate: center.subscriptionEndDate,
      status: center.status,
      createdAt: center.createdAt,

      // 🔑 مؤقت (احذفيه لاحقًا)
      tempPassword,
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
    const { name, city, contactEmail, contactPhone, status } = req.body;

    const center = await Center.findByIdAndUpdate(
      id,
      {
        name,
        city,
        email: contactEmail,
        phone: contactPhone,
        status,
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
      subscriptionPlan: center.subscriptionPlan,
      subscriptionEndDate: center.subscriptionEndDate,
      status: center.status,
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
