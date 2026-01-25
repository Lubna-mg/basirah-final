import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { FaFilePdf, FaChartBar } from "react-icons/fa";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // ✅ تقرير إداري عام (بدون centerId)
    setReports([
      {
        id: "admin-summary",
        title: "التقرير الإداري - ملخص المنصة",
        type: "إداري",
        period: "حالي",
        createdAt: new Date(),
        downloadUrl: "/api/v1/admin/reports/admin-summary",
      },
    ]);
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <header>
          <h2 className="text-2xl font-bold text-[#0A2A43] flex items-center gap-2">
            <FaChartBar />
            التقارير
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            تقارير إدارية مبنية على بيانات فعلية من المنصة
          </p>
        </header>

        {/* Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            label="عدد التقارير المتاحة"
            value={reports.length}
          />
        </section>

        {/* Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="border-b text-gray-500 text-xs">
              <tr>
                <th className="py-3 px-4">عنوان التقرير</th>
                <th>النوع</th>
                <th>الفترة</th>
                <th>تاريخ الإنشاء</th>
                <th className="text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 px-4 font-semibold text-[#0A2A43]">
                    {r.title}
                  </td>
                  <td>{r.type}</td>
                  <td>{r.period}</td>
                  <td className="text-gray-500">
                    {r.createdAt.toLocaleDateString("ar-SA")}
                  </td>
                  <td className="text-center">
                    <a
                      href={`${API_BASE}${r.downloadUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#0A2A43] hover:underline"
                    >
                      <FaFilePdf />
                      تحميل
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AdminLayout>
  );
}

/* ===== Components ===== */

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-[#0A2A43]">{value}</p>
    </div>
  );
}
