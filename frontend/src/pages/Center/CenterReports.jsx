import CenterLayout from "../../layouts/CenterLayout";
import { FaClipboardList, FaSearch } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api"; // ✅ axios الموحّد

export default function CenterReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ======================
     جلب التقارير
  ====================== */
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/center/reports");
        setReports(res.data.reports || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "فشل تحميل التقارير"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  /* ======================
     فلترة + بحث
  ====================== */
  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchesQuery =
        r.childName?.toLowerCase().includes(query.toLowerCase()) ||
        r.doctorName?.toLowerCase().includes(query.toLowerCase()) ||
        r.reportNumber?.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : r.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [reports, query, statusFilter]);

  const statusBadge = (status) => {
    switch (status) {
      case "جاهز":
        return "bg-gray-100 text-black border-gray-300";
      case "قيد المراجعة":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "تم التسليم":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <CenterLayout>
      <div className="space-y-6">
        {/* ===== Header ===== */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaClipboardList />
            تقارير المركز
          </h1>
          <p className="text-sm text-gray-500">
            جميع التقارير الصادرة من أطباء المركز.
          </p>
        </div>

        {/* ===== Filters ===== */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative max-w-md w-full">
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث برقم التقرير، الطفل أو الطبيب..."
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded-lg py-2 pr-10 pl-3 text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg py-2 px-3 bg-white text-sm"
          >
            <option value="all">كل الحالات</option>
            <option value="جاهز">جاهز</option>
            <option value="قيد المراجعة">قيد المراجعة</option>
            <option value="تم التسليم">تم التسليم</option>
          </select>
        </div>

        {/* ===== States ===== */}
        {loading && <p className="text-sm text-gray-500">جاري التحميل...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* ===== Table ===== */}
        {!loading && (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="border-b text-gray-500 text-xs">
                <tr>
                  <th className="py-2 px-3">رقم التقرير</th>
                  <th>الطفل</th>
                  <th>الطبيب</th>
                  <th>النوع</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b last:border-none">
                    <td className="py-2 px-3 font-mono">
                      {r.reportNumber}
                    </td>
                    <td className="font-semibold">{r.childName}</td>
                    <td className="text-gray-600">{r.doctorName}</td>
                    <td className="text-gray-600">{r.type}</td>
                    <td className="text-gray-500">{r.date}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full border text-xs ${statusBadge(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="text-left">
                      <button className="text-xs underline">
                        عرض التقرير
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-4 text-center text-gray-400"
                    >
                      لا توجد تقارير
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CenterLayout>
  );
}
