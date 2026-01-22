// src/pages/Admin/AdminActivity.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";

const ACTION_LABELS = {
  create_center: "إضافة مركز جديد",
  update_center: "تعديل بيانات مركز",
  delete_center: "حذف مركز",
  create_admin_user: "إضافة حساب أدمن",
  update_admin_user: "تعديل حساب أدمن",
  delete_admin_user: "حذف حساب أدمن",
  admin_login: "تسجيل دخول أدمن",
};

export default function AdminActivity() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleAuthError = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin-login");
  };

  const loadActivities = async (pageToLoad = 1) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin-login");
        return;
      }

      const params = new URLSearchParams({ page: pageToLoad, limit });
      const res = await fetch(`/api/admin/activity?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        setError("جلسة الدخول منتهية أو التوكن غير صالح");
        handleAuthError();
        return;
      }

      if (!res.ok) {
        throw new Error("فشل في تحميل سجل الأحداث");
      }

      const data = await res.json();
      setActivities(data.activities || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
    } catch (err) {
      console.error("activity log error:", err);
      setError(err.message || "حدث خطأ أثناء تحميل سجل الأحداث");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.ceil(total / limit) || 1;

  const formatAction = (action) => {
    if (ACTION_LABELS[action]) return ACTION_LABELS[action];
    return action || "حدث";
  };

  const formatMeta = (meta) => {
    if (!meta || typeof meta !== "object") return "";
    if (meta.centerId && meta.name) {
      return `المركز: ${meta.name}`;
    }
    if (meta.adminId && meta.email) {
      return `الحساب: ${meta.email}`;
    }
    return "";
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* الهيدر (ممكن تعدلين النصوص لو حابة تحتفظين بالستايل القديم) */}
        <header>
          <h2 className="text-2xl font-bold text-indigo-800">
            سجل الأحداث
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            متابعة عمليات الأدمن: إضافة أو تعديل المراكز، الحسابات، وغيرها.
          </p>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-center text-sm text-gray-500">
            جاري تحميل سجل الأحداث...
          </p>
        )}

        {!loading && activities.length === 0 && !error && (
          <p className="text-center text-sm text-gray-400">
            لا توجد أحداث مسجلة حتى الآن.
          </p>
        )}

        {!loading && activities.length > 0 && (
          <>
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="border-b text-xs text-gray-500">
                  <tr>
                    <th className="py-2">الحدث</th>
                    <th>التفاصيل</th>
                    <th>اسم الأدمن</th>
                    <th>البريد</th>
                    <th>التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((a) => (
                    <tr key={a.id} className="border-b last:border-none">
                      <td className="py-2 font-semibold text-gray-800">
                        {formatAction(a.action)}
                      </td>
                      <td className="text-xs text-gray-500">
                        {formatMeta(a.meta)}
                      </td>
                      <td className="text-sm text-gray-800">
                        {a.adminName}
                      </td>
                      <td className="text-xs text-gray-500">
                        {a.adminEmail}
                      </td>
                      <td className="text-xs text-gray-500">
                        {a.createdAt
                          ? new Date(a.createdAt).toLocaleString("ar-SA")
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* صفحات */} 
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 text-xs mt-2">
                <button
                  onClick={() => page > 1 && loadActivities(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1 rounded-lg border disabled:opacity-50"
                >
                  السابق
                </button>
                <span>
                  صفحة {page} من {totalPages}
                </span>
                <button
                  onClick={() => page < totalPages && loadActivities(page + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-1 rounded-lg border disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
