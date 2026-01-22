import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api"; // ✅ مهم
import {
  FaChartLine,
  FaCalendarAlt,
  FaHospital,
  FaUserMd,
} from "react-icons/fa";

export default function AdminAnalytics() {
  const [range, setRange] = useState("week");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuthError = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    window.location.href = "/admin-login";
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(
          `/admin/analytics?range=${range}`
        );

        setData(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          handleAuthError();
        } else {
          setError("فشل تحميل بيانات التحليلات");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [range]);

  const current = data?.current || {
    scans: 0,
    activeDoctors: 0,
    activeCenters: 0,
  };

  const avgPerDoctor =
    current.activeDoctors > 0
      ? (current.scans / current.activeDoctors).toFixed(1)
      : 0;

  const avgPerCenter =
    current.activeCenters > 0
      ? (current.scans / current.activeCenters).toFixed(1)
      : 0;

  const topCenters = data?.topCenters || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* ===== Header ===== */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A2A43] flex items-center gap-2">
              <FaChartLine className="text-[#135C8A]" />
              تحليلات المنصة
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              نظرة شاملة على استخدام المراكز والأطباء
            </p>
          </div>

          {/* Range */}
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 border">
            <FaCalendarAlt className="text-[#135C8A] text-sm" />
            <button
              onClick={() => setRange("week")}
              className={`px-4 py-1 rounded-full text-xs ${
                range === "week"
                  ? "bg-[#135C8A] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              هذا الأسبوع
            </button>
            <button
              onClick={() => setRange("month")}
              className={`px-4 py-1 rounded-full text-xs ${
                range === "month"
                  ? "bg-[#135C8A] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              هذا الشهر
            </button>
          </div>
        </header>

        {/* States */}
        {loading && (
          <div className="bg-white p-4 rounded-xl text-center text-sm text-gray-500">
            جاري تحميل البيانات...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ===== KPIs ===== */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPI label="إجمالي الفحوصات" value={current.scans} />
              <KPI label="المراكز الفعّالة" value={current.activeCenters} />
              <KPI label="الأطباء النشطون" value={current.activeDoctors} />
            </section>

            {/* ===== Averages ===== */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Metric
                icon={<FaUserMd />}
                label="متوسط الفحوصات لكل طبيب"
                value={avgPerDoctor}
              />
              <Metric
                icon={<FaHospital />}
                label="متوسط الفحوصات لكل مركز"
                value={avgPerCenter}
              />
            </section>

            {/* ===== Top Centers ===== */}
            <section className="bg-white rounded-2xl border p-5">
              <h2 className="text-lg font-bold text-[#0A2A43] mb-4">
                أكثر المراكز استخدامًا
              </h2>

              {topCenters.length === 0 ? (
                <p className="text-sm text-gray-400 text-center">
                  لا توجد بيانات كافية بعد
                </p>
              ) : (
                <ul className="space-y-3">
                  {topCenters.map((c, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center border-b pb-2 last:border-none"
                    >
                      <span className="font-medium text-[#0A2A43]">
                        {c.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {c.scans} فحص
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

/* ===== Components ===== */

function KPI({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-5 border text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-3xl font-extrabold text-[#0A2A43]">{value}</p>
    </div>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl p-5 border flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-[#EAF6FF] text-[#135C8A] flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-[#0A2A43]">{value}</p>
      </div>
    </div>
  );
}
