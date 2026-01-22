import { useState } from "react";
import { FaEye, FaEyeSlash, FaUserMd } from "react-icons/fa";
import api from "../../api/axios"; // تأكد من مسار الـ api

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("الرجاء إدخال بريد إلكتروني صحيح.");
      return;
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/doctor/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.clear();

      // ✅ نفس اسم التوكن المستخدم في الإدمن
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "doctorData",
        JSON.stringify({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
        })
      );

      window.location.replace("/doctor-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "فشل تسجيل الدخول، تأكدي من البيانات"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#EAF6FF] to-[#C8DFF5]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#0A2A43] text-white mb-4">
            <FaUserMd size={24} />
          </div>
          <h1 className="text-2xl font-bold text-[#0A2A43]">تسجيل دخول الطبيب</h1>
          <p className="text-sm text-gray-500 mt-1">إدخال بيانات الطبيب للوصول إلى اللوحة</p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">
            {error}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4"
              />
            </div>

            {/* Password Input */}
            <div className="relative mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <input
                type={showPass ? "text" : "password"}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A2A43] hover:bg-[#135C8A] text-white py-3 rounded-lg"
            >
              {loading ? "جاري الدخول..." : "تسجيل دخول"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          في حال عدم تفعيل الحساب، يرجى التواصل مع إدارة المنصة
        </div>
      </div>
    </div>
  );
}
