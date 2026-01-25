import Center from "../../models/Center.js";
import Activity from "../../models/Activity.js";
import bcrypt from "bcryptjs";

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
        address: c.address || "-",
        contactEmail: c.email,
        contactPhone: c.phone,
        subscriptionPlan: c.subscriptionPlan || "تجريبي",
        subscriptionEndDate: c.subscriptionEndDate || null,
        status: c.status || "بانتظار التفعيل",
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
   كلمة المرور الافتراضية: 123456
======================= */
export async function createCenter(req, res) {
  try {
    let { name, city, contactEmail, contactPhone } = req.body;

    if (!name || !contactEmail || !contactPhone) {
      return res.status(400).json({
        message: "اسم المركز والبريد الإلكتروني ورقم الهاتف مطلوبة",
      });
    }

    name = name.trim();
    contactEmail = contactEmail.toLowerCase().trim();
    contactPhone = contactPhone.trim();
    city = city?.trim() || "";

    const existingCenter = await Center.findOne({
      $or: [{ email: contactEmail }, { phone: contactPhone }],
    });

    if (existingCenter) {
      return res.status(409).json({
        message: "البريد الإلكتروني أو رقم الهاتف مستخدم مسبقًا",
      });
    }

    // 🔐 كلمة المرور الافتراضية
    const tempPassword = "123456";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const center = await Center.create({
      name,
      email: contactEmail,
      phone: contactPhone,
      city,

      password: hashedPassword,
      mustChangePassword: true,

      status: "active",
      subscriptionPlan: "تجريبي",

      notifications: {
        reports: true,
        sessions: true,
        payments: true,
        doctors: true,
      },
    });

    try {
      await Activity.create({
        text: `تم إضافة مركز جديد: ${center.name}`,
      });
    } catch (e) {}

    return res.status(201).json({
      id: center._id,
      name: center.name,
      city: center.city,
      contactEmail: center.email,
      contactPhone: center.phone,
      subscriptionPlan: center.subscriptionPlan,
      status: center.status,
      createdAt: center.createdAt,

      // ⚠️ للاختبار فقط
      tempPassword,
    });
  } catch (err) {
    console.error("createCenter error:", err);
    return res.status(500).json({ message: "فشل إضافة المركز" });
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
        ...(name && { name: name.trim() }),
        ...(city && { city: city.trim() }),
        ...(contactEmail && { email: contactEmail.toLowerCase().trim() }),
        ...(contactPhone && { phone: contactPhone.trim() }),
        ...(status && { status }),
      },
      { new: true }
    );

    if (!center) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }

    try {
      await Activity.create({
        text: `تم تعديل مركز: ${center.name}`,
      });
    } catch (e) {}

    return res.json({
      id: center._id,
      name: center.name,
      city: center.city,
      contactEmail: center.email,
      contactPhone: center.phone,
      status: center.status,
    });
  } catch (err) {
    console.error("updateCenter error:", err);
    return res.status(500).json({ message: "فشل تحديث المركز" });
  }
}

/* =======================
   حذف مركز ✅ (هذا كان ناقص)
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
    } catch (e) {}

    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteCenter error:", err);
    return res.status(500).json({ message: "فشل حذف المركز" });
  }
}
