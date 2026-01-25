import CenterLayout from "../../layouts/CenterLayout";
import { FaUserMd, FaSearch, FaPlus } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import api from "../../api/centerApi";


export default function CenterDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  // نموذج إضافة طبيب
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "", // ✅ الاسم الموحد
  });

  /* ======================
     جلب أطباء المركز
  ====================== */
  useEffect(() => {
    api
      .get("/center/doctors")
      .then((res) => {
        setDoctors(res.data.doctors || []);
      })
      .catch(() => {
        setError("فشل تحميل الأطباء");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ======================
     إضافة طبيب
  ====================== */
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.specialty) {
      setError("يرجى تعبئة جميع الحقول");
      return;
    }

    try {
      const res = await api.post("/center/doctors", {
        name: form.name,
        email: form.email,
        password: form.password,
        specialty: form.specialty, // ✅ هذا هو المفتاح
      });

      setDoctors((prev) => [res.data.doctor, ...prev]);
      setShowAdd(false);
      setForm({ name: "", email: "", password: "", specialty: "" });
    } catch (err) {
      setError(err.response?.data?.message || "فشل إضافة الطبيب");
    }
  };

  /* ======================
     فلترة البحث
  ====================== */
  const filtered = useMemo(() => {
    return doctors.filter(
      (d) =>
        d.name?.toLowerCase().includes(query.toLowerCase()) ||
        d.specialty?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, doctors]);

  return (
    <CenterLayout>
      <div className="space-y-6">

        {/* ===== Header ===== */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaUserMd /> أطباء المركز
          </h1>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm"
          >
            <FaPlus /> إضافة طبيب
          </button>
        </div>

        {/* ===== Search ===== */}
        <div className="relative max-w-md">
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن طبيب..."
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded-lg py-2 pr-10 pl-3 text-sm"
          />
        </div>

        {/* ===== Error / Loading ===== */}
        {loading && <p className="text-sm text-gray-500">جاري التحميل...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* ===== Table ===== */}
        {!loading && (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="py-2 px-3">الاسم</th>
                  <th>التخصص</th>
                  <th>البريد</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b last:border-none">
                    <td className="py-2 px-3 font-semibold">{d.name}</td>
                    <td>{d.specialty || "—"}</td>
                    <td className="text-gray-600">{d.email}</td>
                    <td>
                      <span className="text-xs px-2 py-1 rounded-full border">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-400">
                      لا يوجد أطباء
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== Add Doctor Modal ===== */}
        {showAdd && (
          <form
            onSubmit={handleAddDoctor}
            className="bg-white border rounded-xl p-5 space-y-3 max-w-md"
          >
            <h3 className="font-bold">إضافة طبيب</h3>

            <input
              placeholder="اسم الطبيب"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <input
              placeholder="البريد الإلكتروني"
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <input
              placeholder="كلمة المرور (6 أحرف على الأقل)"
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <input
              placeholder="التخصص"
              required
              value={form.specialty}
              onChange={(e) =>
                setForm({ ...form, specialty: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border rounded"
              >
                إلغاء
              </button>
              <button className="px-4 py-2 bg-black text-white rounded">
                حفظ
              </button>
            </div>
          </form>
        )}

      </div>
    </CenterLayout>
  );
}