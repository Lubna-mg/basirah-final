import Center from "../../models/Center.js";
import Activity from "../../models/Activity.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // هذا لحفظ الكلمة المؤقتة

/* =======================
   إضافة مركز جديد (بكلمة مرور تلقائية)
======================= */
export async function createCenter(req, res) {
  try {
    let { name, city, contactEmail, contactPhone } = req.body;

    // ✅ تحقق أساسي
    if (!name || !contactEmail || !contactPhone) {
      return res.status(400).json({
        message: "اسم المركز والبريد الإلكتروني ورقم الهاتف مطلوبة",
      });
    }

    // ✅ تنظيف البيانات (مهم جدًا)
    name = name.trim();
    contactEmail = contactEmail.toLowerCase().trim();
    contactPhone = contactPhone.trim();
    city = city?.trim() || "";

    // ✅ منع التكرار بشكل واضح
    const existingCenter = await Center.findOne({
      $or: [{ email: contactEmail }, { phone: contactPhone }],
    });

    if (existingCenter) {
      return res.status(409).json({
        message: "البريد الإلكتروني أو رقم الهاتف مستخدم مسبقًا",
      });
    }

    // 🔐 توليد كلمة مرور مؤقتة
    const tempPassword = "123456"; // الرمز الافتراضي

    // 🔒 تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const center = await Center.create({
      name,
      email: contactEmail,
      phone: contactPhone,
      city,

      password: hashedPassword, // كلمة المرور المشفرة
      mustChangePassword: true, // إجبار المركز على تغيير كلمة المرور عند أول دخول

      status: "بانتظار التفعيل",
      subscriptionPlan: "تجريبي", // قيمة افتراضية

      notifications: {
        reports: true,
        sessions: true,
        payments: true,
        doctors: true,
      },
    });

    // 📝 تسجيل نشاط
    try {
      await Activity.create({
        text: `تم إضافة مركز جديد: ${center.name}`,
      });
    } catch (logError) {
      console.warn("Activity log failed (createCenter):", logError.message);
    }

    // الرد مع إرسال كلمة المرور الافتراضية (فقط للاختبار)
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

      // ⚠️ مؤقت للاختبار فقط
      tempPassword, // يمكنك حذف هذا السطر في بيئة الإنتاج
    });
  } catch (err) {
    console.error("createCenter error:", err);
    return res.status(500).json({
      message: "فشل إضافة المركز",
    });
  }
}
