import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api"; // ✅ مهم
import { FaUsers, FaClipboardList, FaUserTie, FaCog } from "react-icons/fa";

// تحديد الألوان الخاصة بالحالة
const COLOR_CODES = {
  active: "text-green-600",      // المراكز المفعلة
  pending: "text-yellow-500",    // المراكز قيد التفعيل
  suspended: "text-red-500",     // المراكز الموقوفة
  default: "text-indigo-600",    // الأزرق لحالة التنبيه
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    stats: {},
    recentCenters: [],
    activity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/dashboard");
      setData(res.data);
    } catch (err) {
      setError("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { stats, recentCenters, activity } = data;

  return (
    <AdminLayout title="لوحة تحكم الأدمن">
      <div className="min-h-screen bg-[#F5F9FD] p-6">
        {/* Loading */}
        {loading && <div className="text-gray-600">جاري تحميل البيانات...</div>}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* ===== Stats ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <StatCard
                label="المراكز النشطة"
                value={stats?.activeCenters}
                color="active"
                icon={<FaUsers />}
              />
              <StatCard
                label="عدد الأطباء"
                value={stats?.doctors}
                color="#135C8A"
                icon={<FaUserTie />}
              />
              <StatCard
                label="الفحوصات اليوم"
                value={stats?.todayTests}
                color="#135C8A"
                icon={<FaClipboardList />}
              />
              <StatCard
                label="الحسابات الإدارية"
                value={stats?.adminUsers}
                color="#135C8A"
                icon={<FaCog />}
              />
            </div>

            {/* ===== Bottom Section ===== */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Recent Centers */}
              <section className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#0A2A43] mb-4">
                  أحدث المراكز في النظام
                </h2>

                {recentCenters.length === 0 ? (
                  <p className="text-gray-500">لا توجد مراكز حالياً</p>
                ) : (
                  <div className="space-y-4">
                    {recentCenters.map((center) => (
                      <RecentCenterCard key={center._id} center={center} />
                    ))}
                  </div>
                )}
              </section>

              {/* System Activity */}
              <section className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#0A2A43] mb-4">
                  نشاط النظام الأخير
                </h2>

                {activity.length === 0 ? (
                  <p className="text-gray-500">لا يوجد نشاط حالياً</p>
                ) : (
                  <ul className="space-y-4">
                    {activity.map((act, index) => (
                      <li key={index}>
                        <p className="text-sm text-[#0A2A43]">{act.text}</p>
                        <span className="text-xs text-gray-500">{act.timeLabel}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

/* ===== Components ===== */

function StatCard({ label, value, color = "default", icon }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <h2 className={`text-3xl font-bold ${color === 'default' ? 'text-[#135C8A]' : color}`}>
            {value ?? "-"}
          </h2>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#EAF6FF] flex items-center justify-center text-[#135C8A] text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function RecentCenterCard({ center }) {
  const { name, planName, status } = center;

  const statusMap = {
    active: {
      label: "مفعّل",
      className: "bg-[#135C8A] text-white", // الأزرق الغامق كـ لون رئيسي
    },
    pending: {
      label: "قيد التفعيل",
      className: "bg-yellow-100 text-yellow-700", // اللون الأصفر لحالة "قيد التفعيل"
    },
    inactive: {
      label: "غير مفعّل",
      className: "bg-gray-200 text-gray-500", // لون رمادي لحالة "غير مفعّل"
    },
  };

  const statusInfo = statusMap[status] || statusMap.inactive;

  return (
    <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition">
      <div>
        <p className="font-semibold text-[#0A2A43]">{name}</p>
        <p className="text-sm text-gray-500">{planName}</p>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}
      >
        {statusInfo.label}
      </span>
    </div>
  );
}
