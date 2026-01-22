import DoctorLayout from "../../layouts/DoctorLayout";
import { FaMicroscope, FaChevronLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const STATUS_MAP = {
  completed: {
    label: "مكتمل",
    className: "text-green-700 bg-green-100",
  },
  cancelled: {
    label: "غير مكتمل",
    className: "text-red-700 bg-red-100",
  },
};

export default function DoctorScans() {
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await api.get("/doctor/tests");
        setScans(res.data);
      } catch (err) {
        console.error(err);
        setError("تعذر تحميل الفحوصات");
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, []);

  return (
    <DoctorLayout>
      {/* ===== Title ===== */}
      <h1 className="text-3xl font-bold text-[#0A2A43] mb-6 flex items-center gap-2">
        <FaMicroscope /> الفحوصات
      </h1>

      <div className="bg-white border shadow-sm rounded-xl p-6">
        {loading && <p className="text-center">جاري التحميل...</p>}

        {!loading && error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {!loading && !error && scans.length === 0 && (
          <p className="text-gray-500 text-center">
            لا توجد فحوصات بعد
          </p>
        )}

        {!loading && !error && scans.length > 0 && (
          <table className="w-full text-right">
            <thead>
              <tr className="border-b bg-[#EAF6FF] text-[#0A2A43]">
                <th className="p-3">#</th>
                <th className="p-3">اسم المريض</th>
                <th className="p-3">تاريخ الفحص</th>
                <th className="p-3">الحالة</th>
                <th className="p-3">تفاصيل</th>
              </tr>
            </thead>

            <tbody>
              {scans.map((scan, index) => {
                const status =
                  STATUS_MAP[scan.status] || STATUS_MAP.completed;

                return (
                  <tr
                    key={scan._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{index + 1}</td>

                    <td className="p-3">
                      {scan.patient?.name || "—"}
                    </td>

                    <td className="p-3">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 text-sm rounded-lg font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
  onClick={() =>
    navigate(`/doctor-report/${scan._id}`)

  }
  className="flex items-center gap-1 text-[#135C8A] hover:text-[#0A2A43] font-bold"
>
  عرض <FaChevronLeft size={14} />
</button>

                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DoctorLayout>
  );
}
