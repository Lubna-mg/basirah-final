// src/pages/Admin/AdminInvoices.jsx
import AdminLayout from "../../layouts/AdminLayout";
import { FaFileInvoiceDollar } from "react-icons/fa";

export default function AdminInvoices() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">

        {/* ===== Header ===== */}
        <header>
          <h2 className="text-2xl font-bold text-[#0A2A43] flex items-center gap-2">
            <FaFileInvoiceDollar className="text-[#135C8A]" />
            الفواتير
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            عرض الفواتير الصادرة للمراكز والاشتراكات
          </p>
        </header>

        {/* ===== Summary (Design Only) ===== */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard label="إجمالي الفواتير" value="0" />
          <SummaryCard label="مدفوعة" value="0" color="text-green-600" />
          <SummaryCard label="غير مدفوعة" value="0" color="text-red-600" />
        </section>

        {/* ===== Invoices Table ===== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-[#0A2A43] mb-4">
            فواتير المراكز
          </h3>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-sm">
            <FaFileInvoiceDollar className="text-4xl mb-3 text-gray-300" />
            لا توجد فواتير حالياً
            <span className="text-xs text-gray-400 mt-1">
              سيتم عرض الفواتير هنا عند تفعيل نظام الدفع
            </span>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

/* ===== Components ===== */

function SummaryCard({ label, value, color = "text-[#0A2A43]" }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-extrabold ${color}`}>
        {value}
      </p>
    </div>
  );
}
