import DoctorLayout from "../../layouts/DoctorLayout";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  FaCalendarAlt,
  FaUserInjured,
  FaClock,
} from "react-icons/fa";

export default function DoctorNotes() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today"); // today | week | upcoming

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/doctor/appointments");
        setAppointments(res.data || []);
      } catch (err) {
        console.error("Appointments error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  /* =========================
     Helpers
  ========================= */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  const isThisWeek = (date) => {
    const d = new Date(date);
    const start = new Date(today);
    const end = new Date(today);
    end.setDate(end.getDate() + 7);
    return d >= start && d <= end;
  };

  /* =========================
     ترتيب + فلترة
  ========================= */
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const filteredAppointments = sortedAppointments.filter((a) => {
    if (filter === "today") return isToday(a.date);
    if (filter === "week") return isThisWeek(a.date);
    return new Date(a.date) > today;
  });

  const statusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const statusText = (status) => {
    switch (status) {
      case "completed":
        return "منتهي";
      case "cancelled":
        return "ملغي";
      default:
        return "مجدول";
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* ===== العنوان ===== */}
        <div>
          <h1 className="text-3xl font-bold text-[#0A2A43] flex items-center gap-3">
            <FaCalendarAlt />
            جدول المواعيد
          </h1>
          <p className="text-gray-600 mt-1">
            المواعيد المجدولة لك من قبل إدارة المركز
          </p>
        </div>

        {/* ===== الفلاتر ===== */}
        <div className="flex gap-3">
          <FilterButton
            active={filter === "today"}
            onClick={() => setFilter("today")}
          >
            اليوم
          </FilterButton>

          <FilterButton
            active={filter === "week"}
            onClick={() => setFilter("week")}
          >
            هذا الأسبوع
          </FilterButton>

          <FilterButton
            active={filter === "upcoming"}
            onClick={() => setFilter("upcoming")}
          >
            القادمة
          </FilterButton>
        </div>

        {/* ===== حالات ===== */}
        {loading && (
          <p className="text-center text-gray-500">
            جاري تحميل جدول المواعيد...
          </p>
        )}

        {!loading && filteredAppointments.length === 0 && (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
            لا توجد مواعيد في هذا القسم
          </div>
        )}

        {/* ===== المواعيد ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAppointments.map((a) => (
            <div
              key={a._id}
              className={`border rounded-2xl p-6 shadow-sm transition
                ${
                  isToday(a.date)
                    ? "bg-[#F0F7FF] border-[#135C8A]"
                    : "bg-white hover:shadow-md"
                }
              `}
            >
              {/* رأس الكرت */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <p className="font-semibold text-[#0A2A43] flex items-center gap-2">
                    <FaUserInjured />
                    {a.patient?.name || "مريض غير معروف"}
                  </p>
                  <p className="text-sm text-gray-500">
                    رقم الملف: {a.patient?.file_number || "—"}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${statusStyle(
                    a.status
                  )}`}
                >
                  {statusText(a.status)}
                </span>
              </div>

              {/* وقت الموعد */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <FaClock />
                {new Date(a.date).toLocaleString("ar-SA")}
                {isToday(a.date) && (
                  <span className="text-[#135C8A] font-semibold">
                    • اليوم
                  </span>
                )}
              </div>

              {/* ملاحظة */}
              {a.note && (
                <div className="bg-[#F9FBFF] border border-[#E3EEFF] rounded-lg p-3 text-sm text-[#0A2A43]">
                  📝 {a.note}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </DoctorLayout>
  );
}

/* ===== زر فلترة ===== */
function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full font-semibold text-sm transition
        ${
          active
            ? "bg-[#135C8A] text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }
      `}
    >
      {children}
    </button>
  );
}
