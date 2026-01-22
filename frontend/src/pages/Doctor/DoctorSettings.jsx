import DoctorLayout from "../../layouts/DoctorLayout";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function DoctorSettings() {
  const [loading, setLoading] = useState(true);

  /* ======================
     Profile
  ====================== */
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [email, setEmail] = useState("");
  const [centerName, setCenterName] = useState(""); // 👈 اسم المستشفى (عرض فقط)

  /* ======================
     Password
  ====================== */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ======================
     Notifications (UI only)
  ====================== */
  const [notifications, setNotifications] = useState({
    reports: true,
    notes: true,
    system: false,
  });

  /* ======================
     Fetch settings
  ====================== */
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.get("/doctor/settings");
        setName(res.data.name || "");
        setSpecialty(res.data.specialty || "");
        setEmail(res.data.email || "");
        setCenterName(res.data.center?.name || "—"); // 👈 لو موجود
      } catch (err) {
        toast.error("فشل تحميل بيانات الحساب");
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
      await api.put("/doctor/settings/profile", {
        name,
        specialty,
      });

      toast.success("تم تحديث البيانات بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  /* ======================
     Change password
  ====================== */
  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      return toast.error("جميع الحقول مطلوبة");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("كلمتا المرور غير متطابقتين");
    }

    try {
      await api.put("/doctor/settings/password", {
        currentPassword,
        newPassword,
      });

      toast.success("تم تغيير كلمة المرور");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "فشل تغيير كلمة المرور"
      );
    }
  };

  if (loading) {
    return (
      <DoctorLayout>
        <p className="text-center mt-20 text-gray-500">
          جاري تحميل الإعدادات...
        </p>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-10">

        {/* ===== حالة الحساب ===== */}
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

        {/* ======================
            Profile
        ====================== */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-6 text-[#0A2A43]">
            معلومات الطبيب
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">الاسم الكامل</label>
              <input
                className="w-full border rounded-lg p-3 mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">التخصص</label>
              <input
                className="w-full border rounded-lg p-3 mt-1"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                البريد الإلكتروني
              </label>
              <input
                className="w-full border rounded-lg p-3 mt-1 bg-gray-100"
                value={email}
                disabled
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                اسم المستشفى / المركز
              </label>
              <input
                className="w-full border rounded-lg p-3 mt-1 bg-gray-100"
                value={centerName}
                disabled
              />
            </div>
          </div>

          <button
            onClick={saveProfile}
            className="mt-6 bg-[#135C8A] text-white px-6 py-3 rounded-lg"
          >
            حفظ التعديلات
          </button>
        </div>

        {/* ======================
            Password
        ====================== */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-6 text-[#0A2A43]">
            تغيير كلمة المرور
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">
                كلمة المرور الحالية
              </label>
              <input
                type="password"
                className="w-full border rounded-lg p-3 mt-1"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                className="w-full border rounded-lg p-3 mt-1"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                className="w-full border rounded-lg p-3 mt-1"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={changePassword}
            className="mt-6 bg-[#135C8A] text-white px-6 py-3 rounded-lg"
          >
            تحديث كلمة المرور
          </button>
        </div>

        {/* ======================
            Notifications (UI only)
        ====================== */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-6 text-[#0A2A43]">
            الإشعارات
          </h2>

          <div className="space-y-4">
            {[
              { key: "reports", label: "إشعارات التقارير الطبية" },
              { key: "notes", label: "إشعارات الملاحظات" },
              { key: "system", label: "إشعارات النظام" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex justify-between items-center"
              >
                <span className="text-gray-700">{item.label}</span>
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      [item.key]: !notifications[item.key],
                    })
                  }
                  className="w-5 h-5 accent-[#135C8A]"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </DoctorLayout>
  );
}
