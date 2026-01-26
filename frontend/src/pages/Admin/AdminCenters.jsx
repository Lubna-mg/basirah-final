import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import { FaMapMarkerAlt, FaPlus, FaTrash, FaEdit } from "react-icons/fa";

/* =========================
   Constants (مطابقة للـ Schema)
========================= */
const STATUS_OPTIONS = [
  { value: "بانتظار التفعيل", label: "بانتظار التفعيل" },
  { value: "مفعّل", label: "مفعّل" },
  { value: "موقّف", label: "موقّف" },
];

const PLAN_OPTIONS = [
  { value: "تجريبي", label: "تجريبي" },
  { value: "شهرية", label: "شهرية" },
  { value: "سنوية", label: "سنوية" },
];

export default function AdminCenters() {
  const navigate = useNavigate();

  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    city: "",
    contactEmail: "",
    contactPhone: "",
    status: "بانتظار التفعيل",
    subscriptionPlan: "تجريبي",
  });

  /* =========================
     Fetch Centers
  ========================= */
  const fetchCenters = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/centers");
      setCenters(res.data.centers || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/admin-login", { replace: true });
      } else {
        setError("فشل تحميل بيانات المراكز");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  /* =========================
     Helpers
  ========================= */
  const resetForm = () => {
    setForm({
      name: "",
      city: "",
      contactEmail: "",
      contactPhone: "",
      status: "بانتظار التفعيل",
      subscriptionPlan: "تجريبي",
    });
    setMode("add");
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     Submit (Add / Edit)
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.contactEmail || !form.contactPhone) {
      setError("اسم المركز، البريد الإلكتروني، ورقم الجوال مطلوبة");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (mode === "edit") {
        // في التعديل نرسل كل القيم المسموحة
        await api.put(`/admin/centers/${editingId}`, {
          name: form.name,
          city: form.city,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          status: form.status,
        });
      } else {
        // في الإضافة نرسل أقل شي (عشان ما نكسر الـ schema)
        await api.post("/admin/centers", {
          name: form.name,
          city: form.city,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
        });
      }

      await fetchCenters();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "فشل حفظ بيانات المركز");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (center) => {
    setMode("edit");
    setEditingId(center.id);
    setForm({
      name: center.name || "",
      city: center.city || "",
      contactEmail: center.contactEmail || "",
      contactPhone: center.contactPhone || "",
      status: center.status || "بانتظار التفعيل",
      subscriptionPlan: center.subscriptionPlan || "تجريبي",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكدة من حذف المركز؟")) return;

    try {
      await api.delete(`/admin/centers/${id}`);
      await fetchCenters();
    } catch {
      setError("فشل حذف المركز");
    }
  };

  /* =========================
     Render
  ========================= */
  return (
    <AdminLayout title="إدارة المراكز">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0A2A43]">المراكز</h1>
            <p className="text-sm text-gray-500">
              إدارة المراكز الطبية المسجّلة في النظام
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm((v) => !v);
            }}
            className="flex items-center gap-2 bg-[#0A2A43] text-white px-4 py-2 rounded-lg"
          >
            <FaPlus />
            إضافة مركز
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="name"
              placeholder="اسم المركز"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            <input
              name="city"
              placeholder="المدينة"
              value={form.city}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="contactEmail"
              placeholder="البريد الإلكتروني"
              value={form.contactEmail}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            <input
              name="contactPhone"
              placeholder="رقم الجوال"
              value={form.contactPhone}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            {mode === "edit" && (
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            )}

            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border px-4 py-2 rounded"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#0A2A43] text-white px-4 py-2 rounded"
              >
                {saving ? "جارٍ الحفظ..." : "حفظ"}
              </button>
            </div>
          </form>
        )}

        {loading && <p className="text-gray-500">جاري التحميل...</p>}

        {!loading && centers.length === 0 && (
          <p className="text-gray-400 text-center">
            لا توجد مراكز مسجلة حتى الآن
          </p>
        )}

        {!loading && centers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {centers.map((center) => (
              <div
                key={center.id}
                className="bg-white border rounded-xl p-5 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{center.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FaMapMarkerAlt /> {center.city || "—"}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                    {center.status}
                  </span>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleEdit(center)}
                    className="text-indigo-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(center.id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
