import CenterLayout from "../../layouts/CenterLayout";
import { useEffect, useState } from "react";
import api from "../../api/centerApi";
import { FaUserPlus } from "react-icons/fa";

export default function CenterPatients() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    doctor: "", // ObjectId
    
  });

  /* ======================
     تحميل المرضى + الأطباء
  ====================== */
  useEffect(() => {
    Promise.all([
      api.get("/center/patients"),
      api.get("/center/doctors"),
    ])
      .then(([patientsRes, doctorsRes]) => {
        setPatients(patientsRes.data.patients || []);
        setDoctors(doctorsRes.data.doctors || []);
      })
      .catch(() => {
        setError("فشل تحميل البيانات");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ======================
     إضافة مريض
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.age || !form.gender || !form.doctor) {
      setError("يرجى تعبئة جميع الحقول");
      return;
    }

    try {
      const res = await api.post("/center/patients", {
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        doctor: form.doctor, // ObjectId صحيح
      });

      setPatients((prev) => [res.data.patient, ...prev]);

      setForm({
        name: "",
        age: "",
        gender: "",
        doctor: "",
      });

      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "فشل إضافة المريض");
    }
  };

  if (loading) {
    return (
      <CenterLayout>
        <p className="text-gray-400">جاري التحميل...</p>
      </CenterLayout>
    );
  }

  return (
    <CenterLayout>
      <div className="max-w-6xl space-y-8">

        {/* ===== Header ===== */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">المرضى</h1>
            <p className="text-sm text-gray-500">
              إدارة ملفات المرضى وربطهم بالأطباء
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#0F2A4D] text-white px-4 py-2 rounded-lg"
          >
            <FaUserPlus />
            إضافة مريض
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
            <h3 className="font-semibold text-lg">إضافة مريض جديد</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="اسم الطفل"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />

              <Input
                label="العمر"
                type="number"
                value={form.age}
                onChange={(v) => setForm({ ...form, age: v })}
              />

              {/* الجنس */}
              <div>
                <label className="text-sm text-gray-500">الجنس</label>
                <select
                  value={form.gender}
                  onChange={(e) =>
                    setForm({ ...form, gender: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">اختر الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              {/* الطبيب */}
              <div>
                <label className="text-sm text-gray-500">الطبيب المسؤول</label>
                <select
                  value={form.doctor}
                  onChange={(e) =>
                    setForm({ ...form, doctor: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">اختر الطبيب</option>

                  {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-[#0F2A4D] text-white"
              >
                حفظ
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border px-6 py-2 rounded-lg"
              >
                إلغاء
              </button>
            </div>

            <p className="text-xs text-gray-400">
              رقم الملف يتم توليده تلقائيًا بعد الحفظ
            </p>
          </form>
        )}

        {/* ===== Patients List ===== */}
        <div className="bg-white border rounded-xl">
          {patients.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              لا يوجد مرضى حتى الآن
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="py-3 px-4 text-right">الاسم</th>
                  <th>العمر</th>
                  <th>الجنس</th>
                  <th>الطبيب</th>
                  <th>رقم الملف</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p._id} className="border-b last:border-0">
                    <td className="py-3 px-4">{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.gender === "male" ? "ذكر" : "أنثى"}</td>
                    <td>{p.doctor?.name || "—"}</td>
                    <td>{p.file_number}</td>
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
   Input Component
====================== */
function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mt-1"
      />
    </div>
  );
}
