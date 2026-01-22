import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api"; // ✅
import { FaUserMd } from "react-icons/fa";

export default function AdminDoctors() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/admin/doctors");

        const normalizedDoctors = Array.isArray(res.data)
          ? res.data
          : res.data.doctors || [];

        setDoctors(normalizedDoctors);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminInfo");
          navigate("/admin-login", { replace: true });
        } else {
          setError("فشل في تحميل بيانات الأطباء");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [navigate]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">

        {/* ===== Header ===== */}
        <header>
          <h2 className="text-2xl font-bold text-[#0A2A43] flex items-center gap-2">
            <FaUserMd className="text-[#135C8A]" />
            الأطباء
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            قائمة بجميع الأطباء المرتبطين بالمراكز في النظام
          </p>
        </header>

        {/* ===== Error ===== */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ===== Loading ===== */}
        {loading && (
          <p className="text-center text-gray-500">
            جاري تحميل بيانات الأطباء...
          </p>
        )}

        {/* ===== Empty ===== */}
        {!loading && doctors.length === 0 && !error && (
          <p className="text-center text-sm text-gray-400 mt-6">
            لا يوجد أطباء حتى الآن
          </p>
        )}

        {/* ===== Doctors Grid ===== */}
        {!loading && doctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc._id || doc.id}
                className="bg-white border border-gray-100 rounded-2xl p-5
                           hover:shadow-md transition-shadow flex gap-4"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 flex items-center justify-center
                             rounded-full bg-[#EAF6FF] text-[#135C8A] text-lg"
                >
                  <FaUserMd />
                </div>

                {/* Info */}
                <div className="flex flex-col text-right">
                  <h3 className="text-base font-bold text-[#0A2A43]">
                    {doc.name}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {doc.specialty || "—"}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {doc.center?.name
                      ? `يتبع لمركز: ${doc.center.name}`
                      : "غير مرتبط بأي مركز"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {doc.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
