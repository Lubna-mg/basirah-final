import Center from "../../models/Center.js";
import Activity from "../../models/Activity.js";
import bcrypt from "bcryptjs";

/* =======================
   جلب جميع المراكز
======================= */
export async function listCenters(req, res) {
  try {
    const centers = await Center.find().sort({ createdAt: -1 });

    res.json({
      centers: centers.map((c) => ({
        id: c._id,
        name: c.name,
        city: c.city || "-",
        address: c.address || "-",
        contactEmail: c.email,
        contactPhone: c.phone,
        subscriptionPlan: c.subscriptionPlan,
        status: c.status,
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    console.error("listCenters error:", err);
    res.status(500).json({ message: "فشل تحميل المراكز" });
  }
}

/* =======================
   إضافة مركز جديد
   🔥 بدون شرط تغيير كلمة المرور
======================= */
export async function createCenter(req, res) {
  try {
    let { name, city, contactEmail, contactPhone } = req.body;

    if (!name || !contactEmail || !contactPhone) {
      return res.status(400).json({
        message: "اسم المركز، البريد الإلكتروني، ورقم الهاتف مطلوبة",
      });
    }

    name = name.trim();
    contactEmail = contactEmail.toLowerCase().trim();
    contactPhone = contactPhone.trim();
    city = city?.trim() || "";

    // منع التكرار
    const exists = await Center.findOne({
      $or: [{ email: contactEmail }, { phone: contactPhone }],
    });

    if (exists) {
      return res.status(409).json({
        message: "البريد الإلكتروني أو رقم الهاتف مستخدم مسبقًا",
      });
    }

    // كلمة مرور افتراضية
    const tempPassword = "123456";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const center = await Center.create({
      name,
      email: contactEmail,
      phone: contactPhone,
      city,
      password: hashedPassword,

      // 🔥 الحل هنا
      mustChangePassword: false,

      status: "مفعّل",
      subscriptionPlan: "تجريبي",
    });

    // Activity (اختياري)
    Activity.create({
      text: `تم إضافة مركز جديد: ${center.name}`,
    }).catch(() => {});

    return res.status(201).json({
      id: center._id,
      name: center.name,
      email: center.email,
      phone: center.phone,
      city: center.city,
      status: center.status,
      subscriptionPlan: center.subscriptionPlan,
      createdAt: center.createdAt,

      // للاختبار فقط
      tempPassword,
    });
  } catch (err) {
    console.error("🔥 CREATE CENTER ERROR 🔥");
    console.error(err);

    return res.status(500).json({
      message: err.message || "فشل إضافة المركز",
    });
  }
}

/* =======================
   تعديل مركز
======================= */
export async function updateCenter(req, res) {
  try {
    const { id } = req.params;
    const updates = {};

    if (req.body.name) updates.name = req.body.name.trim();
    if (req.body.city) updates.city = req.body.city.trim();
    if (req.body.contactEmail)
      updates.email = req.body.contactEmail.toLowerCase().trim();
    if (req.body.contactPhone)
      updates.phone = req.body.contactPhone.trim();
    if (req.body.status) updates.status = req.body.status;

    const center = await Center.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!center) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }

    Activity.create({
      text: `تم تعديل مركز: ${center.name}`,
    }).catch(() => {});

    res.json({
      id: center._id,
      name: center.name,
      email: center.email,
      phone: center.phone,
      city: center.city,
      status: center.status,
    });
  } catch (err) {
    console.error("updateCenter error:", err);
    res.status(500).json({ message: "فشل تحديث المركز" });
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

    Activity.create({
      text: `تم حذف مركز: ${center.name}`,
    }).catch(() => {});

    res.json({ ok: true });
  } catch (err) {
    console.error("deleteCenter error:", err);
    res.status(500).json({ message: "فشل حذف المركز" });
  }
}
