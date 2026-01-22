import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

export default function AdminSubscriptions() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState("");

  /* ======================
     Auth Error
  ====================== */
  const handleAuthError = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin-login");
  };

  /* ======================
     Fetch Summary
  ====================== */
  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const res = await api.get("/admin/subscriptions/summary");
      setSummary(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleAuthError();
        return;
      }
      setError("فشل في تحميل ملخص الاشتراكات");
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  /* ======================
     Fetch List
  ====================== */
  const fetchList = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await api.get("/admin/subscriptions");
      setSubscriptions(res.data.subscriptions || []);
    } catch (err) {
      if (err.response?.status === 401) {
        handleAuthError();
        return;
      }
      setError("فشل في تحميل قائمة الاشتراكات");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }
    fetchSummary();
    fetchList();
  }, [fetchSummary, fetchList, navigate]);

  /* ======================
     Activate Subscription
  ====================== */
  const activateSubscription = async (id) => {
    try {
      await api.put(`/admin/subscriptions/${id}/activate`);
      fetchSummary();
      fetchList();
    } catch {
      alert("فشل تفعيل الاشتراك");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">

        {/* ===== Header ===== */}
        <header>
          <h2 className="text-2xl font-bold text-[#0A2A43]">
            الاشتراكات
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            إدارة اشتراكات المراكز
          </p>
        </header>

        {/* ===== Error ===== */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ===== Summary ===== */}
        {!loadingSummary && summary && (
          <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <SummaryCard label="إجمالي المراكز" value={summary.totalCenters} />
            <SummaryCard label="مفعّلة" value={summary.activeCenters} color="text-green-600" />
            <SummaryCard label="بانتظار التفعيل" value={summary.pendingCenters} color="text-yellow-600" />
            <SummaryCard label="موقّفة" value={summary.suspendedCenters} color="text-red-600" />
          </section>
        )}

        {/* ===== Table ===== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-lg font-bold text-[#0A2A43] mb-4">
            اشتراكات المراكز
          </h3>

          {loadingList ? (
            <p className="text-center text-sm text-gray-500">
              جاري التحميل...
            </p>
          ) : subscriptions.length === 0 ? (
            <p className="text-center text-sm text-gray-400">
              لا توجد اشتراكات
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="border-b text-xs text-gray-500">
                  <tr>
                    <th className="py-2">المركز</th>
                    <th>المدينة</th>
                    <th>الخطة</th>
                    <th>الحالة</th>
                    <th>ينتهي في</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((s) => (
                    <tr key={s.id} className="border-b last:border-none hover:bg-gray-50">
                      <td className="py-2 font-semibold text-[#0A2A43]">
                        {s.centerName}
                      </td>
                      <td className="text-gray-500">
                        {s.city || "—"}
                      </td>
                      <td>{mapPlan(s.plan)}</td>
                      <td className="flex items-center gap-2 py-2">
                        <StatusBadge status={s.status} />
                        {s.status === "pending" && (
                          <button
                            onClick={() => activateSubscription(s.id)}
                            className="text-xs px-3 py-1 rounded bg-[#0A2A43] text-white"
                          >
                            تفعيل
                          </button>
                        )}
                      </td>
                      <td className="text-gray-500">
                        {s.endDate
                          ? new Date(s.endDate).toLocaleDateString("ar-SA")
                          : "غير محدد"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

/* ======================
   Helpers & Components
====================== */

function SummaryCard({ label, value, color = "text-[#0A2A43]" }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-extrabold ${color}`}>
        {value ?? "-"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: { text: "مفعّل", cls: "bg-green-100 text-green-700" },
    pending: { text: "بانتظار التفعيل", cls: "bg-yellow-100 text-yellow-700" },
    suspended: { text: "موقّف", cls: "bg-red-100 text-red-700" },
  };

  const s = map[status] || map.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.cls}`}>
      {s.text}
    </span>
  );
}

function mapPlan(plan) {
  if (plan === "trial") return "تجريبية";
  if (plan === "monthly") return "شهرية";
  if (plan === "yearly") return "سنوية";
  return plan || "—";
}