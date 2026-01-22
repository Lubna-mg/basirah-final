import { useState, useReducer } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  FaUserShield,
  FaUserPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { useAdminUsers } from "../../hooks/useAdminUsers";

// نظام الصلاحيات الأساسي
const ROLE_PERMISSIONS = {
  "أدمن رئيسي": [
    "إدارة جميع المراكز",
    "إضافة وتعديل وحذف المستخدمين الإداريين",
    "التحكم في الاشتراكات والفوترة",
    "الوصول لجميع التقارير والتحليلات",
    "تعديل إعدادات النظام",
  ],
  "مشرفة اشتراكات": [
    "إدارة اشتراكات المراكز",
    "متابعة الفواتير",
    "تنبيه المراكز بقرب انتهاء الاشتراك",
  ],
  "مشرفة مراكز": [
    "إضافة وتعديل بيانات المراكز",
    "تغيير حالة المراكز (مفعّل/موقّف)",
    "متابعة نشاط المراكز",
  ],
  "دعم فني": [
    "متابعة بلاغات المراكز",
    "الوصول لسجل الأخطاء",
    "التواصل مع المراكز لحل المشكلات",
  ],
};

// تحويل الدور من الواجهة إلى القيمة التي يتوقعها الباك اند
const toBackendRole = (roleLabel) =>
  roleLabel === "أدمن رئيسي" ? "super-admin" : "admin";

// تحويل الدور من الباك اند إلى تسمية عربية للعرض
const fromBackendRole = (backendRole) =>
  backendRole === "super-admin" ? "أدمن رئيسي" : "مشرف";

// إعادة استخدام دالة للتحقق من البريد الإلكتروني
const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email);
};

// الحالة الأولية للنموذج
const initialState = {
  name: "",
  email: "",
  role: "أدمن رئيسي",
  status: "مفعّل",
};

// الدالة المسؤولة عن تغيير حالة النموذج
function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function AdminUsers() {
  const {
    admins,
    loading,
    error,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    resetAdminPassword,
  } = useAdminUsers();

  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("add");
  const [editingId, setEditingId] = useState(null);

  // استخدام useReducer لإدارة الحالة
  const [formUser, dispatch] = useReducer(formReducer, initialState);

  const uiUsers = (admins || []).map((a) => ({
    id: a.id || a._id,
    name: a.name,
    email: a.email,
    role: fromBackendRole(a.role),
    status: a.isActive ? "مفعّل" : "موقّف",
    lastLogin: a.lastLogin || "—",
  }));

  const filteredUsers = uiUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", field: name, value });
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();

    if (!formUser.name.trim() || !formUser.email.trim()) {
      alert("رجاءً أدخلي الاسم والبريد الإلكتروني.");
      return;
    }

    if (!validateEmail(formUser.email)) {
      alert("البريد الإلكتروني غير صالح.");
      return;
    }

    try {
      if (mode === "add") {
        const password = window.prompt("أدخلي كلمة المرور المبدئية للمشرف:");
        if (!password) return;

        await createAdmin({
          name: formUser.name.trim(),
          email: formUser.email.trim(),
          password,
          role: toBackendRole(formUser.role),
        });
      } else if (mode === "edit" && editingId) {
        await updateAdmin(editingId, {
          name: formUser.name.trim(),
          role: toBackendRole(formUser.role),
          isActive: formUser.status === "مفعّل",
        });
      }

      // إعادة ضبط النموذج
      dispatch({ type: "RESET" });
      setEditingId(null);
      setMode("add");
      setShowForm(false);
    } catch (err) {
      alert(err.message || "حدث خطأ أثناء حفظ المستخدم");
    }
  };

  const handleEditClick = (user) => {
    setMode("edit");
    setEditingId(user.id);
    dispatch({ type: "SET_FIELD", field: "name", value: user.name });
    dispatch({ type: "SET_FIELD", field: "email", value: user.email });
    dispatch({ type: "SET_FIELD", field: "role", value: user.role });
    dispatch({ type: "SET_FIELD", field: "status", value: user.status });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const yes = window.confirm("هل أنتِ متأكدة من حذف هذا المستخدم؟");
    if (!yes) return;

    try {
      await deleteAdmin(id);
    } catch (err) {
      alert(err.message || "فشل حذف المستخدم");
    }
  };

  const handleToggleStatus = async (id) => {
    const user = uiUsers.find((u) => u.id === id);
    if (!user) return;

    try {
      await updateAdmin(id, {
        isActive: user.status !== "مفعّل",
      });
    } catch (err) {
      alert(err.message || "فشل تغيير حالة الحساب");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-indigo-800">حسابات المشرفين</h2>
          <p className="text-sm text-gray-500 mt-1">
            إدارة من لديهم صلاحية دخول لوحة الأدمن.
          </p>
        </div>

        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition text-sm font-semibold"
          onClick={() => {
            setMode("add");
            setEditingId(null);
            dispatch({ type: "RESET" });
            setShowForm((v) => !v);
          }}
        >
          <FaUserPlus />
          {showForm ? "إغلاق النموذج" : "إضافة مستخدم"}
        </button>
      </div>

      {error && (
        <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 bg-white shadow rounded-xl p-6 border border-indigo-50">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">
            {mode === "add" ? "إضافة مستخدم جديد" : "تعديل بيانات المستخدم"}
          </h3>

          <form
            onSubmit={handleAddOrEdit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="text-sm font-medium text-gray-700">
                الاسم الكامل
              </label>
              <input
                type="text"
                name="name"
                value={formUser.name}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="مثال: لولو العتيبي"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formUser.email}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="example@basira.com"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                الدور الوظيفي
              </label>
              <select
                name="role"
                value={formUser.role}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
              >
                <option value="أدمن رئيسي">أدمن رئيسي</option>
                <option value="مشرفة اشتراكات">مشرفة اشتراكات</option>
                <option value="مشرفة مراكز">مشرفة مراكز</option>
                <option value="دعم فني">دعم فني</option>
              </select>

              <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <p className="text-xs font-semibold text-indigo-900 mb-2">
                  صلاحيات هذا الدور:
                </p>

                <ul className="list-disc pr-5 space-y-1 text-[12px] text-indigo-800">
                  {ROLE_PERMISSIONS[formUser.role]?.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                حالة الحساب
              </label>
              <select
                name="status"
                value={formUser.status}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
              >
                <option value="مفعّل">مفعّل</option>
                <option value="موقّف">موقّف</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setMode("add");
                }}
                className="px-4 py-2 rounded-lg border text-sm text-gray-600"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
              >
                {mode === "add" ? "حفظ المستخدم" : "تحديث البيانات"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6 relative max-w-md">
        <FaSearch className="absolute right-4 top-3 text-gray-400" />
        <input
          type="text"
          className="w-full border rounded-lg py-2 px-12"
          placeholder="ابحث بالاسم أو البريد..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
        {loading ? (
          <p className="text-center py-6 text-gray-500 text-sm">
            جاري تحميل الحسابات...
          </p>
        ) : (
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b text-gray-500 text-xs">
                <th className="py-3">الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الدور</th>
                <th>الحالة</th>
                <th>آخر تسجيل دخول</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b last:border-none">
                  <td className="py-3 font-semibold">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>

                  <td>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        u.status === "مفعّل"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status === "مفعّل" ? <FaToggleOn /> : <FaToggleOff />}
                      {u.status}
                    </span>
                  </td>

                  <td className="text-gray-500">{u.lastLogin}</td>

                  <td>
                    <div className="flex items-center gap-3 justify-end text-base">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        title="تفعيل / إيقاف"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {u.status === "مفعّل" ? (
                          <FaToggleOff />
                        ) : (
                          <FaToggleOn />
                        )}
                      </button>

                      <button
                        onClick={() => handleEditClick(u)}
                        title="تعديل"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(u.id)}
                        title="حذف"
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="py-6 text-center text-gray-400 text-sm"
                  >
                    لا توجد حسابات مطابقة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
