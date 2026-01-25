import CenterLayout from "../../layouts/CenterLayout";
import { useEffect, useState } from "react";
import api from "../../api/centerApi";
import {
  FaCalendarPlus,
  FaClock,
  FaUserMd,
  FaUserInjured,
} from "react-icons/fa";

export default function CenterAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    doctor: "",
    patient: "",
    date: "",
    time: "",
    notes: "",
  });

  /* ======================
     تحميل البيانات
  ====================== */
  useEffect(() => {
    Promise.all([
      api.get("/center/appointments"),
      api.get("/center/doctors"),
      api.get("/center/patients"),
    ])
      .then(([aRes, dRes, pRes]) => {
        setAppointments(aRes.data.appointments || []);
        setDoctors(dRes.data.doctors || []);
        setPatients(pRes.data.patients || []);
      })
      .catch(() => setError("فشل تحميل بيانات المواعيد"))
      .finally(() => setLoading(false));
  }, []);

  /* ======================
     إنشاء موعد
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.doctor || !form.patient || !form.date || !form.time) {
      setError("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }

    try {
      const dateTime = new Date(
        `${form.date}T${form.time}:00`
      ).toISOString();

      const res = await api.post("/center/appointments", {
        doctor: form.doctor,
        patient: form.patient,
        date: dateTime,
        notes: form.notes,
      });

      setAppointments((prev) => [res.data.appointment, ...prev]);
      setShowForm(false);

      setForm({
        doctor: "",
        patient: "",
        date: "",
        time: "",
        notes: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "فشل إنشاء الموعد"
      );
    }
  };

  if (loading) {
    return (
      <CenterLayout>
        <p className="text-gray-400">جاري تحميل المواعيد...</p>
      </CenterLayout>
    );
  }

  return (
    <CenterLayout>
      <div className="max-w-7xl space-y-8">

        {/* ===== Header ===== */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">
              المواعيد
            </h1>
            <p className="text-sm text-gray-500">
              تنظيم مواعيد الأطباء والمرضى داخل المركز
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#0F2A4D] text-white px-4 py-2 rounded-lg"
          >
            <FaCalendarPlus />
            إضافة موعد
          </button>
        </div>

        {/* ===== Error ===== */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* ===== Form ===== */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border rounded-xl p-6 space-y-6"
          >
            <h3 className="font-semibold text-lg">
              إضافة موعد جديد
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* الطبيب */}
              <Select
                label="الطبيب"
                value={form.doctor}
                onChange={(v) =>
                  setForm({ ...form, doctor: v })
                }
                options={doctors.map((d) => ({
                  value: d._id, // ✅ الصحيح
                  label: d.name,
                }))}
                              />

              {/* المريض */}
              <Select
                label="المريض"
                value={form.patient}
                onChange={(v) =>
                  setForm({ ...form, patient: v })
                }
                options={patients.map((p) => ({
                  value: p._id, // ✅ المريض يرجّع _id
                  label: p.name,
                }))}
              />

              {/* التاريخ */}
              <Input
                label="التاريخ"
                type="date"
                value={form.date}
                onChange={(v) =>
                  setForm({ ...form, date: v })
                }
              />

              {/* الوقت */}
              <Input
                label="الوقت"
                type="time"
                value={form.time}
                onChange={(v) =>
                  setForm({ ...form, time: v })
                }
              />
            </div>

            {/* ملاحظات */}
            <div>
              <label className="text-sm text-gray-500">
                ملاحظات (اختياري)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#0F2A4D] text-white px-6 py-2 rounded-lg"
              >
                حفظ الموعد
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border px-6 py-2 rounded-lg"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        {/* ===== Appointments List ===== */}
        <div className="bg-white border rounded-xl">
          {appointments.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              لا توجد مواعيد حتى الآن
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="py-3 px-4 text-right">
                    <FaClock className="inline ml-1" />
                    التاريخ
                  </th>
                  <th>
                    <FaUserMd className="inline ml-1" />
                    الطبيب
                  </th>
                  <th>
                    <FaUserInjured className="inline ml-1" />
                    المريض
                  </th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr
                    key={a._id}
                    className="border-b last:border-0"
                  >
                    <td className="py-3 px-4">
                      {new Date(a.date).toLocaleString("ar-SA")}
                    </td>
                    <td>{a.doctor?.name}</td>
                    <td>{a.patient?.name}</td>
                    <td>
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </CenterLayout>
  );
}

/* ======================
   Components
====================== */

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-500">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mt-1"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm text-gray-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mt-1"
      >
        <option value="">اختر</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    scheduled: "مجدول",
    completed: "مكتمل",
    cancelled: "ملغي",
  };

  const color =
    status === "completed"
      ? "bg-green-100 text-green-700"
      : status === "cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs ${color}`}
    >
      {map[status] || status}
    </span>
  );
}