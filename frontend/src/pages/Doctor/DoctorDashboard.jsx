import { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import api from "../../api/axios";
import {
  FaUserInjured,
  FaMicroscope,
  FaStickyNote,
  FaChartPie,
} from "react-icons/fa";
import { Link } from "react-router-dom";

/* =========================
   Doctor Dashboard
========================= */
export default function DoctorDashboard() {
  const [data, setData] = useState({
    patientsCount: 0,
    completedTests: 0,
    notesCount: 0,
    latestTests: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/doctor/dashboard");

        setData({
          patientsCount: res.data?.patientsCount || 0,
          completedTests: res.data?.completedTests || 0,
          notesCount: res.data?.notesCount || 0,
          latestTests: res.data?.latestTests || [],
        });
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("تعذر تحميل بيانات لوحة التحكم");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DoctorLayout>
        <div className="p-10 text-center text-gray-500">
          جاري تحميل البيانات...
        </div>
      </DoctorLayout>
    );
  }

  if (error) {
    return (
      <DoctorLayout>
        <div className="p-10 text-center text-red-600 font-semibold">
          {error}
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">

        {/* ===== العنوان الرسمي ===== */}
        <div>
          <h1 className="text-3xl font-bold text-[#0A2A43] mb-2">
            لوحة التحكم الطبية
          </h1>
          <p className="text-gray-600">
            نظرة عامة على نشاط الطبيب داخل المنصة
          </p>
        </div>

        {/* ===== الكروت ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <DashboardCard
            icon={<FaUserInjured size={26} />}
            label="عدد المرضى"
            value={data.patientsCount}
            color="#135C8A"
          />

          <DashboardCard
            icon={<FaMicroscope size={26} />}
            label="الفحوصات المكتملة"
            value={data.completedTests}
            color="#0A2A43"
          />

          <DashboardCard
            icon={<FaStickyNote size={26} />}
            label="عدد الملاحظات"
            value={data.notesCount}
            color="#74B3CE"
          />

        </div>

        {/* ===== عنصر بياني (تمثيلي) ===== */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#0A2A43] mb-4 flex items-center gap-2">
            <FaChartPie />
            حالة المرضى
          </h2>

          <div className="flex items-center gap-6">
            <StatusBar
              label="فحوصات مكتملة"
              value={data.completedTests}
              color="bg-green-500"
            />
            <StatusBar
              label="قيد المتابعة"
              value={Math.max(
                data.patientsCount - data.completedTests,
                0
              )}
              color="bg-yellow-500"
            />
          </div>
        </div>

        {/* ===== آخر الفحوصات ===== */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-[#0A2A43] mb-6">
            آخر الفحوصات
          </h2>

          {data.latestTests.length === 0 ? (
            <p className="text-gray-500 text-center">
              لا توجد فحوصات مسجلة خلال الفترة الحالية
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#EAF6FF] text-[#0A2A43]">
                  <th className="p-3 text-right">اسم المريض</th>
                  <th className="p-3 text-right">الحالة</th>
                  <th className="p-3 text-right">التاريخ</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {data.latestTests.map((test) => (
                  <tr key={test._id} className="border-b">
                    <td className="p-3">
                      {test.patientName || "—"}
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        test.status === "completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {test.status === "completed"
                        ? "مكتمل"
                        : "قيد المتابعة"}
                    </td>
                    <td className="p-3">
                      {test.date
                        ? new Date(test.date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/doctor-report/${test._id}`}
                        className="text-[#135C8A] hover:underline"
                      >
                        عرض التقرير
                      </Link>
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

/* =========================
   Components
========================= */

function DashboardCard({ icon, label, value, color }) {
  return (
    <div className="bg-white shadow-sm border rounded-xl p-6 flex items-center gap-4">
      <div
        className="text-white p-4 rounded-lg"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <h3 className="text-2xl font-bold text-[#0A2A43]">
          {value}
        </h3>
      </div>
    </div>
  );
}

function StatusBar({ label, value, color }) {
  return (
    <div className="flex-1">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${Math.min(value * 20, 100)}%` }}
        />
      </div>
    </div>
  );
}
