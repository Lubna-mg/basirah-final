import Subscription from "../../models/Subscription.js";
import Center from "../../models/Center.js";

/**
 * ==========================
 * GET /api/v1/center/subscription
 * جلب اشتراك المركز الحالي
 * ==========================
 */
export const getMySubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      center: req.centerId,
    });

    // لو ما فيه اشتراك
    if (!sub) {
      return res.json({
        plan: "trial",
        status: "active",
        endDate: null,
      });
    }

    res.json({
      plan: sub.plan,
      status: sub.status,
      endDate: sub.endDate,
    });
  } catch (error) {
    console.error("getMySubscription error:", error);
    res.status(500).json({
      message: "فشل جلب بيانات الاشتراك",
    });
  }
};

/**
 * ==========================
 * POST /api/v1/center/subscription/request
 * طلب ترقية اشتراك (يدوي)
 * ==========================
 */
export const requestSubscriptionUpgrade = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!["monthly", "yearly"].includes(plan)) {
      return res.status(400).json({
        message: "الباقة غير صالحة",
      });
    }

    // 🔑 جلب الاشتراك الحالي
    const sub = await Subscription.findOne({
      center: req.centerId,
    });

    if (!sub) {
      return res.status(404).json({
        message: "لا يوجد اشتراك مرتبط بهذا المركز",
      });
    }

    // 🚫 لو فيه طلب معلق
    if (sub.status === "pending") {
      return res.status(400).json({
        message: "لديك طلب ترقية قيد المراجعة",
      });
    }

    /**
     * ==========================
     * تحديث Subscription
     * ==========================
     */
    sub.plan = plan;          // monthly | yearly
    sub.status = "pending";   // بانتظار التفعيل
    sub.endDate = null;

    await sub.save();

    /**
     * ==========================
     * 🔥 التعديل المهم: تحديث Center
     * ==========================
     * هذا اللي يربط الداشبورد بالاشتراك الحقيقي
     */
    await Center.findByIdAndUpdate(req.centerId, {
      subscriptionPlan: plan,        // 👈 شهري / سنوي
      subscriptionEndDate: null,     // 👈 لسه ما تفعل
    });

    res.status(200).json({
      message:
        "تم إرسال طلب الترقية بنجاح، سيتم التواصل معكم لتفعيل الاشتراك.",
      subscription: {
        plan: sub.plan,
        status: sub.status,
        endDate: sub.endDate,
      },
    });
  } catch (error) {
    console.error("requestSubscriptionUpgrade error:", error);
    res.status(500).json({
      message: "فشل إرسال طلب الترقية",
    });
  }
};
