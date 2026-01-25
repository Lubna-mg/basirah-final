import CenterLayout from "../../layouts/CenterLayout";
import {
  FaUserMd,
  FaUserInjured,
  FaCalendarCheck,
  FaClipboardList,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/centerApi";


/* =========================
   Helpers
========================= */

// تحويل كل القيم (عربي / إنجليزي) إلى قيمة موحدة
const PLAN_MAP = {
  // تجريبي
  "تجريبي": "trial",
  "تجريبية": "trial",
  trial: "trial",

  // شهري
  "شهري": "monthly",
  "شهريه": "monthly",
  "شهرية": "monthly",
  monthly: "monthly",

  // سنوي
  "سنوي": "yearly",
  "سنوية": "yearly",
  yearly: "yearly",
};

// الاسم العربي النهائي
const PLAN_LABELS = {
  trial: "تجريبية",
  monthly: "شهرية",
  yearly: "سنوية",
};

// الأسعار
const PLAN_PRICES = {
  trial: 0,
  monthly: 699,
  yearly: 6999,
};

export default function CenterDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("centerToken");
    if (!token) {
      setError("لم يتم العثور على توكن المركز");
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await api.get("/center/dashboard");
        setData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "فشل تحميل بيانات لوحة التحكم"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading)
    return (
      <CenterLayout>
        <p className="text-center text-slate-400">جاري تحميل البيانات...</p>
      </CenterLayout>
    );

  if (error)
    return (
      <CenterLayout>
        <p className="text-center text-red-500">{error}</p>
      </CenterLayout>
    );

  const { stats, recentActivity, subscription } = data;

  // 🔑 التحويل الحقيقي
  const rawPlan = subscription?.plan;
  const planType = PLAN_MAP[rawPlan] || "trial";

  const isTrial = planType === "trial";
  const planLabel = PLAN_LABELS[planType];
  const planPrice = PLAN_PRICES[planType];

  return (
    <CenterLayout>
      <div className="space-y-8">
        {/* ===== Header ===== */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            مرحباً بك في لوحة تحكم المركز
          </h1>
          <p className="text-sm text-slate-500">
            نظرة عامة على أداء المركز اليوم
          </p>
        </div>

        {/* ===== Stats ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat title="الأطباء" value={stats.doctors} icon={<FaUserMd />} />
          <Stat
            title="المرضى النشطون"
            value={stats.activePatients}
            icon={<FaUserInjured />}
          />
          <Stat
            title="جلسات اليوم"
            value={stats.todaySessions}
            icon={<FaCalendarCheck />}
          />
          <Stat
            title="المكتملة اليوم"
            value={stats.completedToday}
            icon={<FaClipboardList />}
          />
        </div>

        {/* ===== Middle Section ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-slate-800 mb-4">
              آخر النشاطات
            </h3>

            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-400">لا توجد نشاطات حديثة</p>
            ) : (
              <div className="space-y-3 text-sm">
                {recentActivity.map((a, i) => (
                  <ActivityItem key={i} {...a} />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border p-5 lg:col-span-2">
            <h3 className="font-semibold text-slate-800 mb-4">
              جلسات اليوم
            </h3>
            <div className="text-sm text-slate-400 text-center py-10">
              لا توجد جلسات مجدولة لليوم
            </div>
          </div>
        </div>

        {/* ===== Subscription HERO ===== */}
        <div className="bg-gradient-to-l from-slate-900 to-slate-800 text-white rounded-2xl p-6 flex flex-col md:flex-row md:justify-between gap-6">
          <div>
            <p className="text-xs opacity-80">الاشتراك الحالي</p>
            <h3 className="text-xl font-bold mt-1">{planLabel}</h3>

            <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-300">
              {mapStatus(subscription.status)}
            </span>

            <p className="text-sm opacity-80 mt-3">
              تاريخ الانتهاء:{" "}
              {subscription.endDate
                ? new Date(subscription.endDate).toLocaleDateString("ar-SA")
                : "غير محدد"}
            </p>

            {isTrial && (
              <p className="text-xs text-orange-300 mt-2">
                ⚠️ باقة تجريبية – بعض الميزات محدودة
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 text-left">
            <p className="text-3xl font-bold">{planPrice} ريال</p>
            <p className="text-xs opacity-70">
              {planType === "yearly" ? "سنويًا" : "شهريًا"}
            </p>

            <button
              onClick={() => navigate("/center-subscriptions")}
              className="mt-3 px-6 py-2 rounded-lg bg-white text-slate-900 text-sm font-medium hover:bg-slate-100"
            >
              إدارة الاشتراك
            </button>
          </div>
        </div>
      </div>
    </CenterLayout>
  );
}

/* ===== Components ===== */

function Stat({ title, value, icon }) {
  return (
    <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{title}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({ time, text }) {
  return (
    <div className="flex gap-3">
      <div className="w-2 h-2 mt-2 rounded-full bg-slate-400" />
      <div>
        <p className="text-slate-700">{text}</p>
        <span className="text-xs text-slate-400">
          {new Date(time).toLocaleDateString("ar-SA")}
        </span>
      </div>
    </div>
  );
}

function mapStatus(status) {
  if (status === "active") return "نشط";
  if (status === "expired") return "منتهي";
  if (status === "pending") return "قيد التفعيل";
  if (status === "suspended") return "موقوف";
  return status;
}
