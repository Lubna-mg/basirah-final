import CenterLayout from "../../layouts/CenterLayout";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CenterSubscriptions() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showManage, setShowManage] = useState(false);

  // ✅ إشعارات داخل الصفحة
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* =========================
     جلب الاشتراك
  ========================= */
  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await api.get("/center/subscription");
      setSubscription(res.data);
    } catch {
      setError("تعذر تحميل بيانات الاشتراك");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  /* =========================
     طلب ترقية (دفع يدوي)
  ========================= */
  const requestUpgrade = async (plan) => {
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await api.post("/center/subscription/request", { plan });

      // ✅ رسالة نجاح
      setSuccessMsg(res.data.message);

      // ✅ إعادة جلب الاشتراك (حل المشكلة)
      await fetchSubscription();

      // (اختياري)
      setShowManage(false);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          "حدث خطأ أثناء إرسال طلب الترقية"
      );
    }
  };

  /* =========================
     Loading
  ========================= */
  if (loading) {
    return (
      <CenterLayout>
        <div className="py-12 text-center text-slate-400">
          جاري تحميل بيانات الاشتراك…
        </div>
      </CenterLayout>
    );
  }

  /* =========================
     Error
  ========================= */
  if (error || !subscription) {
    return (
      <CenterLayout>
        <div className="py-12 text-center text-red-500">
          {error || "حدث خطأ غير متوقع"}
        </div>
      </CenterLayout>
    );
  }

  const isTrial = subscription.plan === "trial";

  return (
    <CenterLayout>
      <div className="max-w-6xl space-y-8">

        {/* ===== Header ===== */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            اشتراك المركز
          </h1>
          <p className="text-sm text-slate-500">
            إدارة باقة الاشتراك وطريقة التفعيل
          </p>
        </div>

        {/* ===== إشعارات ===== */}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* ===== Current Subscription ===== */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-6">
            <div>
              <span
                className={`inline-block text-xs px-2 py-1 rounded-full ${
                  subscription.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {mapStatus(subscription.status)}
              </span>

              <h2 className="text-xl font-bold text-slate-800 mt-3">
                باقة {mapPlan(subscription.plan)}
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                السعر:
                <span className="font-semibold text-slate-800">
                  {" "}
                  {getPrice(subscription.plan)} ريال
                </span>
              </p>

              <p className="text-xs text-slate-500 mt-2">
                تاريخ الانتهاء:{" "}
                {subscription.endDate
                  ? new Date(subscription.endDate).toLocaleDateString("ar-SA")
                  : "—"}
              </p>
            </div>

            <button
              onClick={() => setShowManage(!showManage)}
              className="h-fit px-5 py-2 text-sm rounded-lg bg-slate-800 text-white"
            >
              إدارة الاشتراك
            </button>
          </div>

          {/* ===== Status Message ===== */}
          <div className="mt-6 bg-slate-50 border rounded-lg p-4 text-sm text-slate-600">
            {isTrial ? (
              <>
                ⏳ أنت حاليًا على الباقة التجريبية (مدة قصيرة)
                <span className="block text-xs text-slate-500 mt-1">
                  يمكنك الترقية في أي وقت، ولن يتم الخصم تلقائيًا.
                </span>
              </>
            ) : subscription.status === "pending" ? (
              <>
                🕒 طلب الترقية قيد المراجعة من الإدارة
              </>
            ) : (
              <>
                📌 الاشتراك مفعل من قبل الإدارة
              </>
            )}
          </div>
        </div>

        {/* ===== Usage Summary ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard title="الأطباء" value="حسب الباقة" />
          <InfoCard title="الجلسات" value="حسب الباقة" />
          <InfoCard title="التقارير الطبية" value="تقارير تشخيصية ذكية" />
        </div>

        {/* ===== Manage Subscription ===== */}
        {showManage && (
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-slate-800 mb-2">
              الباقات المتاحة
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              يتم تفعيل الاشتراك بعد التنسيق مع إدارة بصيرة.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PlanCard
                title="تجريبية"
                price="0"
                description="تجربة محدودة لمدة قصيرة"
                active={isTrial}
              />

              <PlanCard
                title="شهرية"
                price="999"
                description="مناسبة للمراكز المتوسطة"
                onClick={() => requestUpgrade("monthly")}
              />

              <PlanCard
                title="سنوية"
                price="10,000"
                description="أفضل قيمة للمراكز الكبيرة"
                onClick={() => requestUpgrade("yearly")}
              />
            </div>

            <p className="text-xs text-slate-400 mt-4">
              ⚠️ لا يتم تنفيذ أي عمليات دفع إلكتروني حاليًا.
            </p>
          </div>
        )}

        {/* ===== Support ===== */}
        <div className="bg-slate-50 border rounded-xl p-4 text-sm text-slate-600">
          💬 لطلب الترقية أو الاستفسار عن الباقات،
          <span className="block text-xs text-slate-500 mt-1">
            يرجى التواصل مع إدارة بصيرة.
          </span>
        </div>
      </div>
    </CenterLayout>
  );
}

/* =========================
   Helpers
========================= */

function mapStatus(status) {
  if (status === "active") return "نشط";
  if (status === "pending") return "قيد التفعيل";
  if (status === "suspended") return "موقوف";
  return status;
}

function mapPlan(plan) {
  if (plan === "trial") return "تجريبية";
  if (plan === "monthly") return "شهرية";
  if (plan === "yearly") return "سنوية";
  return plan;
}

function getPrice(plan) {
  if (plan === "trial") return "0";
  if (plan === "monthly") return "999";
  if (plan === "yearly") return "10,000";
  return "—";
}

/* =========================
   Components
========================= */

function InfoCard({ title, value }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-lg font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}

function PlanCard({ title, price, description, active, onClick }) {
  return (
    <div
      className={`border rounded-xl p-5 ${
        active ? "border-slate-800" : ""
      }`}
    >
      <h4 className="font-semibold text-slate-800">
        باقة {title}
      </h4>

      <p className="text-sm text-slate-500 mt-1">
        {description}
      </p>

      <p className="text-2xl font-bold text-slate-800 mt-4">
        {price} ريال
      </p>

      <button
        disabled={active}
        onClick={onClick}
        className={`mt-4 w-full px-4 py-2 text-sm rounded-lg ${
          active
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-slate-800 text-white"
        }`}
      >
        {active ? "الباقة الحالية" : "طلب ترقية"}
      </button>
    </div>
  );
}
