import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUserInjured,
  FaMicroscope,
  FaCamera,
  FaStickyNote,
  FaFileMedical,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function DoctorLayout({ children }) {
  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition";

  const inactive = `${linkBase} text-[#0A2A43] hover:bg-[#DCE6F2]`;
  const active = `${linkBase} bg-[#135C8A] text-white shadow-md font-semibold`;

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">

      {/* ===== Sidebar ===== */}
      <aside className="w-72 bg-white border-l shadow-sm flex flex-col p-6">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="/basira-logo.svg"
            alt="Basira Logo"
            className="w-28 mb-3"
          />
          <h1 className="text-xl font-bold text-[#0A2A43] tracking-wide">
            منصة الطبيب
          </h1>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2">

          <NavLink
            to="/doctor-dashboard"
            className={({ isActive }) => (isActive ? active : inactive)}
          >
            <FaHome size={20} /> الرئيسية
          </NavLink>

          <NavLink
            to="/doctor-scans"
            className={({ isActive }) => (isActive ? active : inactive)}
          >
            <FaMicroscope size={20} /> الفحوصات
          </NavLink>

          <NavLink
            to="/doctor-patients"
            className={({ isActive }) => (isActive ? active : inactive)}
          >
            <FaUserInjured size={20} /> المرضى
          </NavLink>

          <NavLink
            to="/doctor-camera"
            className={({ isActive }) => (isActive ? active : inactive)}
          >
            <FaCamera size={20} /> الفحص
          </NavLink>

          <NavLink
            to="/doctor-notes"
            className={({ isActive }) => (isActive ? active : inactive)}
          >
            <FaStickyNote size={20} /> المواعيد
          </NavLink>

          <NavLink
            to="/doctor-reports"
            className={({ isActive }) => (isActive ? active : inactive)}
          >
            <FaFileMedical size={20} /> التقارير
          </NavLink>

          <NavLink
            to="/doctor-settings"
            className={({ isActive }) => (isActive ? active : inactive)}
          >
            <FaCog size={20} /> الإعدادات
          </NavLink>

        </nav>

        {/* Logout */}
        <button
          onClick={() => (window.location.href = "/doctor-login")}
          className="mt-auto flex items-center gap-3 text-red-600 hover:bg-red-50 p-3 rounded-lg transition text-lg font-semibold"
        >
          <FaSignOutAlt /> تسجيل خروج
        </button>
      </aside>

      {/* ===== Main content ===== */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
