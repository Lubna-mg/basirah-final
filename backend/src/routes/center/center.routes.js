import Subscription from "../../models/Subscription.js";

/**
 * GET /api/v1/center/subscription
 * معلومات الاشتراك (مختصرة للإعدادات)
 */
export const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      center: req.centerId,
    }).sort({ createdAt: -1 });

    // إذا لم يكن هناك اشتراك مسجل، الرجوع بافتراضي (تجريبي)
    if (!subscription) {
      return res.json({
        plan: "تجريبي",
        status: "active",
        endDate: null,
        isTrial: true, // ✅ مهم للواجهة
      });
    }

    // إذا كان الاشتراك موجودًا، نرجع البيانات
    res.json({
      plan: subscription.subscriptionPlan,
      status: subscription.status,
      endDate: subscription.endDate,
      isTrial: subscription.subscriptionPlan === "تجريبي",
      // يمكن إضافة حقول أخرى للتفاصيل الخاصة بالاشتراك في المستقبل
    });
  } catch (error) {
    console.error("getMySubscription error:", error);
    // تحسين رسالة الخطأ بناءً على سبب الفشل
    res.status(500).json({ message: `فشل جلب الاشتراك: ${error.message}` });
  }
};
