import { Link } from "react-router-dom";
import { FaUserShield, FaHospitalUser, FaUserMd } from "react-icons/fa";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#EAF6FF] flex flex-col items-center justify-center px-6 py-10">

      {/* >>>>>>>>>> Logo (كبير وفخم) <<<<<<<<<< */}
      <div className="text-center mb-10">
        <img 
          src="/basira-logo.svg"
          alt="Basira Logo"
          className="w-40 mx-auto mb-4 drop-shadow-lg"
        />

        <p className="text-slate-700 mt-2 text-lg max-w-2xl mx-auto">
          نظام ذكي لتحليل مؤشرات التوحّد عبر حركة العين — مخصص للأطباء والمراكز والإدارة الطبية.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        
        {/* Doctor */}
        <Link
          to="/doctor-login"
          className="bg-white border border-slate-200 hover:border-purple-600 hover:shadow-xl p-8 rounded-2xl flex flex-col items-center text-center transition-all"
        >
          <FaUserMd className="text-purple-600 text-6xl mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            دخول الطبيب
          </h3>
          <p className="text-slate-500 text-sm">
            تحليل فيديوهات الأطفال، مراجعة النتائج، وإضافة الملاحظات.
          </p>
        </Link>

        {/* Center */}
        <Link
          to="/center"
          className="bg-white border border-slate-200 hover:border-green-600 hover:shadow-xl p-8 rounded-2xl flex flex-col items-center text-center transition-all"
        >
          <FaHospitalUser className="text-green-600 text-6xl mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            دخول المركز
          </h3>
          <p className="text-slate-500 text-sm">
            إدارة الأطباء، المرضى، التحارير، وربط الفروع.
          </p>
        </Link>

        {/* Admin */}
        <Link
          to="/admin-login"
          className="bg-white border border-slate-200 hover:border-indigo-600 hover:shadow-xl p-8 rounded-2xl flex flex-col items-center text-center transition-all"
        >
          <FaUserShield className="text-indigo-600 text-6xl mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            دخول الأدمن
          </h3>
          <p className="text-slate-500 text-sm">
            إدارة المنصة، المراكز، الفوترة، والإعدادات العامة.
          </p>
        </Link>

      </div>

      {/* Footer */}
      <p className="text-slate-400 text-xs mt-16">
        © 2025 بصيرة – جميع الحقوق محفوظة.
      </p>
    </div>
  );
}
