// src/controllers/admin/activity.controller.js

export const getActivity = async (req, res) => {
  try {
    // بيانات وهمية مؤقتًا (نربطها لاحقًا بجدول activity)
    const activity = [
      {
        id: 1,
        text: "تم إنشاء مركز جديد",
        timeLabel: "قبل 10 دقائق",
      },
      {
        id: 2,
        text: "تم تفعيل اشتراك مركز",
        timeLabel: "قبل ساعة",
      },
      {
        id: 3,
        text: "تم إضافة طبيب جديد",
        timeLabel: "أمس",
      },
    ];

    res.json({ activity });
  } catch (error) {
    console.error("getActivity error:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب نشاط النظام",
    });
  }
};
