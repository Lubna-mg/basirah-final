import CenterLayout from "../../layouts/CenterLayout";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBell,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function CenterSettings() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    notifications: {
      reports: true,
      sessions: true,
      payments: true,
      doctors: true,
    },
  });

  const [password, setPassword] = useState({
    new: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // رسالة داخلية بدل alert
  const [message, setMessage] = useState(null);
  // message = { type: "success" | "error", text: string }

  /* ================= Load Settings ================= */
  useEffect(() => {
    api
      .get("/center/settings")
      .then((res) => {
        const data = res.data || {};

        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          city: data.city || "",
          notifications: {
            reports: data.notifications?.reports ?? true,
            sessions: data.notifications?.sessions ?? true,
            payments: data.notifications?.payments ?? true,
            doctors: data.notifications?.doctors ?? true,
          },
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading settings:", error);
        setMessage({
          type: "error",
          text: "فشل تحميل الإعدادات، يرجى المحاولة لاحقًا",
        });
        setLoading(false);
      });
  }, []);

  /* ================= Save Center Info ================= */
  const saveCenterInfo = async () => {
    setSaving(true);
    setMessage(null);

    try {
      await api.put("/center/settings", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
      });

      setMessage({
        type: "success",
        text: "تم حفظ بيانات المركز بنجاح",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "حدث خطأ أثناء حفظ البيانات",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ================= Save Notifications ================= */
  const saveNotifications = async () => {
    setSaving(true);
    setMessage(null);

    try {
      await api.put("/center/settings", {
        notifications: form.notifications,
      });

      setMessage({
        type: "success",
        text: "تم تحديث إعدادات الإشعارات",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "فشل تحديث إعدادات الإشعارات",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ================= Change Password ================= */
  const changePassword = async () => {
    setMessage(null);

    if (password.new !== password.confirm) {
      setMessage({
        type: "error",
        text: "كلمتا المرور غير متطابقتين",
      });
      return;
    }

    if (password.new.length < 6) {
      setMessage({
        type: "error",
        text: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      });
      return;
    }

    setSaving(true);
    try {
      await api.put("/center/settings/password", {
        password: password.new,
      });

      setPassword({ new: "", confirm: "" });
      setMessage({
        type: "success",
        text: "تم تغيير كلمة المرور بنجاح",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "فشل تغيير كلمة المرور",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ================= Loading ================= */
  if (loading) {
    return (
      <CenterLayout>
        <p className="text-slate-400">جاري تحميل الإعدادات...</p>
      </CenterLayout>
    );
  }

  return (
    <CenterLayout>
      <div className="max-w-6xl space-y-10">

        {/* ===== Message ===== */}
        {message && (
          <div
            className={`rounded-lg px-4 py-3 text-sm border ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ===== Center Info ===== */}
        <Section title="بيانات المركز" icon={<FaBuilding />}>
          <Grid>
            <Input
              label="اسم المركز"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />

            <Input
              label="البريد الإلكتروني"
              value={form.email}
              disabled
              icon={<FaEnvelope />}
            />

            <Input
              label="رقم التواصل"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              icon={<FaPhone />}
            />

            <Input
              label="المدينة"
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
              icon={<FaMapMarkerAlt />}
            />
          </Grid>

          <SaveButton onClick={saveCenterInfo} loading={saving} />
        </Section>

        {/* ===== Notifications ===== */}
        <Section title="إعدادات الإشعارات" icon={<FaBell />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Toggle
              label="إشعارات التقارير"
              checked={!!form.notifications.reports}
              onChange={(v) =>
                setForm({
                  ...form,
                  notifications: { ...form.notifications, reports: v },
                })
              }
            />
            <Toggle
              label="إشعارات الجلسات"
              checked={!!form.notifications.sessions}
              onChange={(v) =>
                setForm({
                  ...form,
                  notifications: { ...form.notifications, sessions: v },
                })
              }
            />
            <Toggle
              label="إشعارات الدفع"
              checked={!!form.notifications.payments}
              onChange={(v) =>
                setForm({
                  ...form,
                  notifications: { ...form.notifications, payments: v },
                })
              }
            />
            <Toggle
              label="إشعارات الأطباء"
              checked={!!form.notifications.doctors}
              onChange={(v) =>
                setForm({
                  ...form,
                  notifications: { ...form.notifications, doctors: v },
                })
              }
            />
          </div>

          <SaveButton onClick={saveNotifications} loading={saving} />
        </Section>

        {/* ===== Security ===== */}
        <Section title="إعدادات الأمان" icon={<FaShieldAlt />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <PasswordInput
              label="كلمة المرور الجديدة"
              value={password.new}
              onChange={(v) => setPassword({ ...password, new: v })}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
            <PasswordInput
              label="تأكيد كلمة المرور"
              value={password.confirm}
              onChange={(v) =>
                setPassword({ ...password, confirm: v })
              }
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
          </div>

          <button
            onClick={changePassword}
            className="mt-5 px-6 py-2 rounded-lg bg-slate-800 text-white text-sm"
          >
            تحديث كلمة المرور
          </button>
        </Section>

      </div>
    </CenterLayout>
  );
}

/* ================= Reusable Components ================= */

const Section = ({ title, icon, children }) => (
  <section className="bg-white border rounded-xl p-6 space-y-6">
    <div className="flex items-center gap-2 font-semibold text-slate-800">
      {icon} {title}
    </div>
    {children}
  </section>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
    {children}
  </div>
);

const Input = ({ label, value, onChange, icon, disabled }) => (
  <div>
    <label className="text-xs text-slate-500">{label}</label>
    <div className="relative mt-1">
      {icon && (
        <span className="absolute right-3 top-2.5 text-slate-400">
          {icon}
        </span>
      )}
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 ${
          icon ? "pr-10" : ""
        }`}
      />
    </div>
  </div>
);

const PasswordInput = ({ label, value, onChange, show, toggle }) => (
  <div>
    <label className="text-xs text-slate-500">{label}</label>
    <div className="relative mt-1">
      <button
        type="button"
        onClick={toggle}
        className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 pl-10"
      />
    </div>
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer">
    <span>{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  </label>
);

const SaveButton = ({ onClick, loading }) => (
  <div className="flex justify-end">
    <button
      onClick={onClick}
      disabled={loading}
      className="px-6 py-2 rounded-lg bg-slate-800 text-white text-sm"
    >
      {loading ? "جارٍ الحفظ..." : "حفظ التغييرات"}
    </button>
  </div>
);
