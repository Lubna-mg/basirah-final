import Subscription from "../../models/Subscription.js";
import Center from "../../models/Center.js";

/* ======================================================
   GET /api/v1/admin/subscriptions/summary
   ملخص الاشتراكات
====================================================== */
export const getSubscriptionsSummary = async (req, res) => {
  try {
    const subs = await Subscription.find();

    const totalCenters = subs.length;

    const activeCenters = subs.filter(
      (s) => s.status === "active"
    ).length;

    const pendingCenters = subs.filter(
      (s) => s.status === "pending"
    ).length;

    const suspendedCenters = subs.filter(
      (s) => s.status === "suspended"
    ).length;

    const planCounts = subs.reduce((acc, s) => {
      acc[s.plan] = (acc[s.plan] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalCenters,
      activeCenters,
      pendingCenters,
      suspendedCenters,
      planCounts,
    });
  } catch (err) {
    console.error("getSubscriptionsSummary error:", err);
    res.status(500).json({ message: "فشل جلب ملخص الاشتراكات" });
  }
};

/* ======================================================
   GET /api/v1/admin/subscriptions
   قائمة الاشتراكات
====================================================== */
export const getSubscriptionsList = async (req, res) => {
  try {
    const subs = await Subscription.find()
      .populate("center", "name city")
      .sort({ createdAt: -1 });

    const data = subs.map((s) => ({
      id: s._id, // subscriptionId (مهم)
      centerId: s.center?._id,
      centerName: s.center?.name || "—",
      city: s.center?.city || "—",
      plan: s.plan,
      status: s.status,
      startDate: s.startDate,
      endDate: s.endDate,
    }));

    res.json({ subscriptions: data });
  } catch (err) {
    console.error("getSubscriptionsList error:", err);
    res.status(500).json({ message: "فشل جلب قائمة الاشتراكات" });
  }
};

/* ======================================================
   PUT /api/v1/admin/subscriptions/:id/activate
   تفعيل الاشتراك (باستخدام subscriptionId)
====================================================== */
export const activateSubscription = async (req, res) => {
  try {
    const { id } = req.params; // subscriptionId

    const sub = await Subscription.findById(id).populate("center");
    if (!sub) {
      return res.status(404).json({ message: "الاشتراك غير موجود" });
    }

    sub.status = "active";
    sub.startDate = new Date();

    if (sub.plan === "monthly") {
      sub.endDate = new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      );
    } else if (sub.plan === "yearly") {
      sub.endDate = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      );
    } else {
      sub.endDate = null;
    }

    await sub.save();

    // تحديث بيانات المركز المرتبط
    await Center.findByIdAndUpdate(
      sub.center._id,
      {
        status: "active",
        subscriptionPlan:
          sub.plan === "monthly"
            ? "شهرية"
            : sub.plan === "yearly"
            ? "سنوية"
            : "تجريبي",
        subscriptionEndDate: sub.endDate,
      },
      { new: true }
    );

    res.json({
      message: "تم تفعيل الاشتراك بنجاح",
    });
  } catch (err) {
    console.error("activateSubscription error:", err);
    res.status(500).json({ message: "فشل تفعيل الاشتراك" });
  }
};

/* ======================================================
   PUT /api/v1/admin/subscriptions/:id/reset-trial
   إعادة الاشتراك إلى تجريبي
====================================================== */
export const resetSubscriptionToTrial = async (req, res) => {
  try {
    const { id } = req.params; // subscriptionId

    const sub = await Subscription.findById(id).populate("center");
    if (!sub) {
      return res.status(404).json({ message: "الاشتراك غير موجود" });
    }

    sub.plan = "trial";
    sub.status = "active";
    sub.startDate = new Date();
    sub.endDate = null;

    await sub.save();

    await Center.findByIdAndUpdate(
      sub.center._id,
      {
        status: "active",
        subscriptionPlan: "تجريبي",
        subscriptionEndDate: null,
      },
      { new: true }
    );

    res.json({
      message: "تم إرجاع الاشتراك إلى تجريبي",
    });
  } catch (err) {
    console.error("resetSubscriptionToTrial error:", err);
    res.status(500).json({ message: "فشل إرجاع الاشتراك للتجريبي" });
  }
};
