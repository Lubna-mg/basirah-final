import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaBell } from "react-icons/fa";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);

  /* ======================
     Profile
  ====================== */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [platformName, setPlatformName] = useState("");

  /* ======================
     Password
  ====================== */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ======================
     Notifications
  ====================== */
  const [notifications, setNotifications] = useState({
    system: true,
  });

  /* ======================
     Fetch settings
  ====================== */
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.get("/admin/settings");
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setPhone(res.data.phone || "");
        setPlatformName(res.data.platformName || "منصة بصيرة");
      } catch {
        toast.error("فشل تحميل الإعدادات");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  /* ======================
     Save profile
  ====================== */
  const saveProfile = async () => {
    try {
      await api.put("/admin/settings", {
        name,
        email,
        phone,
        platformName,
      });
      toast.success("تم حفظ التعديلات");
    } catch {
      toast.error("فشل حفظ البيانات");
    }
  };

  /* ======================
     Change password
  ====================== */
  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("جميع الحقول مطلوبة");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("كلمتا المرور غير متطابقتين");
    }

    try {
      await api.put("/admin/settings/password", {
        currentPassword,
        newPassword,
      });

      toast.success("تم تحديث كلمة المرور");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل تغيير كلمة المرور");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center mt-20 text-gray-500">
          جاري تحميل الإعدادات...
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ===== Account Status ===== */}
        <div className="bg-[#EAF6FF] border rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold text-[#0A2A43]">حالة الحساب</p>
            <p className="text-sm text-gray-600">
              الحساب مفعل وجاهز للاستخدام
            </p>
          </div>
          <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
            نشط
          </span>
        </div>

        {/* ===== Profile ===== */}
        <Card title="معلومات الحساب">
          <Input label="الاسم" value={name} onChange={setName} />
          <Input label="البريد الإلكتروني" value={email} onChange={setEmail} />
          <Input label="رقم الجوال" value={phone} onChange={setPhone} />
          <Input label="اسم المنصة" value={platformName} onChange={setPlatformName} />

          <button onClick={saveProfile} className="btn-primary">
            حفظ التعديلات
          </button>
        </Card>

        {/* ===== Password ===== */}
        <Card title="تغيير كلمة المرور">
          <PasswordInput
            label="كلمة المرور الحالية"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            toggle={() => setShowCurrent(!showCurrent)}
          />
          <PasswordInput
            label="كلمة المرور الجديدة"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            toggle={() => setShowNew(!showNew)}
          />
          <PasswordInput
            label="تأكيد كلمة المرور"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            toggle={() => setShowConfirm(!showConfirm)}
          />

          <button onClick={changePassword} className="btn-primary">
            تحديث كلمة المرور
          </button>
        </Card>

        {/* ===== Notifications ===== */}
        <Card title="الإشعارات">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-700">
              <FaBell className="text-[#0A2A43]" />
              إشعارات النظام
            </div>
            <input
              type="checkbox"
              checked={notifications.system}
              onChange={() =>
                setNotifications({ system: !notifications.system })
              }
              className="w-5 h-5 accent-[#135C8A]"
            />
          </div>

          <p className="text-xs text-gray-400 mt-2">
            تظهر هذه الإشعارات في جرس التنبيهات أعلى المنصّة.
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
}

/* ======================
   Reusable Components
====================== */

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h2 className="text-xl font-bold text-[#0A2A43]">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <input
        className="w-full border rounded-lg p-3 mt-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function PasswordInput({ label, value, onChange, show, toggle }) {
  return (
    <div className="relative">
      <label className="text-sm font-semibold">{label}</label>
      <input
        type={show ? "text" : "password"}
        className="w-full border rounded-lg p-3 mt-1 pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute left-3 top-10 text-gray-400"
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}
