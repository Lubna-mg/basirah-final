import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHospitalUser, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../api/centerApi";

export default function CenterLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ======================
     لو عنده توكن → دخليه مباشرة
  ====================== */
  useEffect(() => {
    const token = localStorage.getItem("centerToken");
    if (token) {
      navigate("/center-dashboard");
    }
  }, [navigate]);

  /* ======================
     تسجيل الدخول
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/center/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      /* 🔴 حالة مركز لازم يغير كلمة المرور */
      if (res.data.message === "MUST_CHANGE_PASSWORD") {
        localStorage.setItem("tempCenterId", res.data.centerId);
        navigate("/center-change-password");
        return;
      }

      /* ✅ تسجيل دخول طبيعي */
      localStorage.setItem("centerToken", res.data.token);
      localStorage.setItem(
        "centerInfo",
        JSON.stringify(res.data.center)
      );

      navigate("/center-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "فشل تسجيل الدخول"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4F9FD] to-[#DCE6F2]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#0A2A43] text-white mb-4">
            <FaHospitalUser size={24} />
          </div>
          <h1 className="text-2xl font-bold text-[#0A2A43]">
            تسجيل دخول المركز
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            الدخول لإدارة الأطباء والمرضى
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A2A43]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0A2A43]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A2A43] hover:bg-[#135C8A] transition text-white py-2.5 rounded-lg font-semibold"
          >
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          في حال عدم تفعيل الحساب، يرجى التواصل مع إدارة المنصة
        </div>
      </div>
    </div>
  );
}
