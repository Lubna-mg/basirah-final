import Doctor from "../../models/Doctor.js";

/**
 * =========================
 * GET /api/v1/center/doctors
 * =========================
 */
export const getCenterDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ center: req.centerId })
      .select("_id name specialty email isActive")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      doctors,
    });
  } catch (err) {
    console.error("getCenterDoctors error:", err);
    res.status(500).json({ message: "فشل جلب الأطباء" });
  }
};

/**
 * =========================
 * POST /api/v1/center/doctors
 * =========================
 */
export const addCenterDoctor = async (req, res) => {
  try {
    const { name, email, password, specialty } = req.body;

    // ✅ تحقق أساسي
    if (!name || !email || !password || !specialty) {
      return res.status(400).json({
        message: "يرجى إدخال الاسم، البريد الإلكتروني، كلمة المرور، والتخصص",
      });
    }

    // ✅ منع تكرار البريد
    const exists = await Doctor.findOne({ email });
    if (exists) {
      return res.status(400).json({
        message: "البريد الإلكتروني مستخدم مسبقًا",
      });
    }

    // ✅ إنشاء الطبيب (التشفير يتم في المودل)
    const doctor = await Doctor.create({
      name,
      email,
      password,
      specialty,
      center: req.centerId,
      isActive: true,
    });

    res.status(201).json({
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        isActive: true,
      },
    });
  } catch (err) {
    console.error("addCenterDoctor error:", err);
    res.status(500).json({ message: "فشل إضافة الطبيب" });
  }
};
