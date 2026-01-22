// src/pages/Admin/AdminBilling.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminBilling() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [error, setError] = useState("");

  const handleAuthError = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin-login");
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        const res = await fetch("/api/admin/billing/summary", {
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
          throw new Error("فشل في تحميل ملخص الفوترة");
        }

        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("billing summary error:", err);
        setError(err.message || "حدث خطأ أثناء تحميل ملخص الفوترة");
      } finally {
        setLoadingSummary(false);
      }
    };

    const fetchInvoices = async () => {
      try {
        setLoadingInvoices(true);
        const res = await fetch("/api/admin/billing/invoices", {
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
          throw new Error("فشل في تحميل الفواتير");
        }

        const data = await res.json();
        setInvoices(data.invoices || []);
      } catch (err) {
        console.error("billing invoices error:", err);
        setError(err.message || "حدث خطأ أثناء تحميل الفواتير");
      } finally {
        setLoadingInvoices(false);
      }
    };

    fetchSummary();
    fetchInvoices();
  }, [navigate]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* العنوان */}
        <header>
          <h2 className="text-2xl font-bold text-indigo-800">
            الفوترة
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            متابعة إجمالي المدفوعات، الفواتير، وحالة السداد للمراكز.
          </p>
        </header>

        {/* رسالة خطأ */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* كروت الملخص */}
        {!loadingSummary && summary && (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-indigo-50">
              <p className="text-xs text-gray-500">إجمالي الفواتير</p>
              <p className="text-2xl font-extrabold text-gray-900">
                {summary.totalPayments}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-indigo-50">
              <p className="text-xs text-gray-500">فواتير مدفوعة</p>
              <p className="text-2xl font-extrabold text-green-600">
                {summary.paidPayments}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-indigo-50">
              <p className="text-xs text-gray-500">فواتير قيد الانتظار</p>
              <p className="text-2xl font-extrabold text-yellow-500">
                {summary.pendingPayments}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-indigo-50">
              <p className="text-xs text-gray-500">إجمالي الإيرادات (تقريبي)</p>
              <p className="text-2xl font-extrabold text-indigo-700">
                {summary.totalRevenue.toLocaleString("ar-SA")}{" "}
                <span className="text-sm font-normal">ر.س</span>
              </p>
            </div>
          </section>
        )}

        {/* جدول الفواتير */}
        <section className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            الفواتير
          </h3>

          {loadingInvoices ? (
            <p className="text-center text-sm text-gray-500">
              جاري تحميل الفواتير...
            </p>
          ) : invoices.length === 0 ? (
            <p className="text-center text-sm text-gray-400">
              لا توجد فواتير مسجلة حالياً.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="border-b text-xs text-gray-500">
                  <tr>
                    <th className="py-2">رقم الفاتورة</th>
                    <th>المركز</th>
                    <th>المبلغ</th>
                    <th>الحالة</th>
                    <th>التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b last:border-none">
                      <td className="py-2 font-semibold">
                        {inv.invoiceNumber}
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span>{inv.centerName}</span>
                          <span className="text-xs text-gray-400">
                            {inv.centerCity}
                          </span>
                        </div>
                      </td>
                      <td>
                        {inv.amount.toLocaleString("ar-SA")}{" "}
                        <span className="text-xs text-gray-500">
                          {inv.currency}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            inv.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : inv.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {inv.status === "paid"
                            ? "مدفوعة"
                            : inv.status === "pending"
                            ? "قيد الانتظار"
                            : "فشلت"}
                        </span>
                      </td>
                      <td className="text-gray-500">
                        {inv.paidAt
                          ? new Date(inv.paidAt).toLocaleString("ar-SA")
                          : "—"}
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
