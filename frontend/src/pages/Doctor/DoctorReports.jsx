import DoctorLayout from "../../layouts/DoctorLayout";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function DoctorReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fileNumber, setFileNumber] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");

  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    final: 0,
  });

  /* ======================
     جلب التقارير (Tests المعتمدة)
  ====================== */
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/doctor/tests"); // ✅ المصدر الصحيح
      const data = res.data || [];

      setReports(data);

      // حساب الإحصائيات بدون كسر التصميم
      setStats({
        total: data.length,
        draft: 0,
        final: data.length,
      });
    } catch (err) {
      console.error("Reports error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  /* ======================
     حذف التقرير (test)
  ====================== */
  const handleDelete = async (id) => {
  if (!confirm("هل أنت متأكد من حذف التقرير؟")) return;

  try {
    await api.delete(`/doctor/tests/${id}`);
    setReports((prev) => prev.filter((r) => r._id !== id));
    alert("تم حذف التقرير بنجاح 🗑️");
  } catch (err) {
    console.error("Delete error:", err);
    alert("فشل حذف التقرير");
  }
};


  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* ===== العنوان ===== */}
        <div>
          <h1 className="text-3xl font-bold text-[#0A2A43] mb-1">
            التقارير الطبية
          </h1>
          <p className="text-gray-600">
            متابعة وتحليل تقارير فحوصات المرضى
          </p>
        </div>

        {/* ===== الإحصائيات (كما هي) ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="إجمالي التقارير"
            value={stats.total}
            color="bg-blue-500"
            active
          />
          <StatCard
            title="مسودات"
            value={stats.draft}
            color="bg-yellow-400"
          />
          <StatCard
            title="معتمدة"
            value={stats.final}
            color="bg-green-500"
          />
        </div>

        {/* ===== الجدول ===== */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <p className="p-6 text-center text-gray-500">
              جاري تحميل البيانات...
            </p>
          ) : reports.length === 0 ? (
            <p className="p-6 text-center text-gray-500">
              لا توجد تقارير
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-[#EAF6FF] text-[#0A2A43]">
                <tr>
                  <th className="p-3 text-right">المريض</th>
                  <th className="p-3 text-right">رقم الملف</th>
                  <th className="p-3 text-right">الحالة</th>
                  <th className="p-3 text-right">التاريخ</th>
                  <th className="p-3 text-right">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((r) => (
                  <tr key={r._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {r.patient?.name || "—"}
                    </td>

                    <td className="p-3">
                      {r.patient?.file_number || "—"}
                    </td>

                    <td className="p-3 font-semibold text-green-600">
                      معتمد
                    </td>

                    <td className="p-3">
                      {new Date(r.createdAt).toLocaleDateString("ar-SA")}
                    </td>

                    {/* ===== الإجراءات ===== */}
                    <td className="p-3">
                      <div className="flex items-center justify-between">

                        {/* فتح التقرير */}
                        <Link
                          to={`/doctor-report/${r._id}`}
                          className="text-[#135C8A] font-semibold hover:underline"
                        >
                          فتح التقرير
                        </Link>

                        {/* تعديل / حذف */}
                        

                          <button
                            onClick={() => handleDelete(r._id)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="حذف التقرير"
                          >
                            <FaTrash />
                          </button>
                        </div>

                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </DoctorLayout>
  );
}

/* ===== Card ===== */
function StatCard({ title, value, color, active }) {
  return (
    <div
      className={`bg-white border rounded-xl p-5 flex items-center justify-between shadow-sm
        ${active ? "ring-2 ring-[#135C8A]" : ""}`}
    >
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-[#0A2A43]">{value}</h3>
      </div>
      <div className={`w-3 h-12 rounded-full ${color}`} />
    </div>
  );
}
