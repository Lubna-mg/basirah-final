import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaUserMd,
  FaCreditCard,
  FaFileInvoice,
  FaChartLine,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import { useEffect } from "react";

export default function AdminLayout({ children, title = "أهلاً أدمن" }) {
  const navigate = useNavigate();

  // حماية الأدمن
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin-login", { replace: true });
  }, [navigate]);

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition";

  const inactive = `${linkBase} text-[#0A2A43] hover:bg-[#DCE6F2]`;
  const active = `${linkBase} bg-[#135C8A] text-white shadow-md font-semibold`;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin-login");
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]" dir="rtl">

      {/* ===== Sidebar ===== */}
      <aside className="w-72 bg-[#F3F7FB] border-l shadow-sm flex flex-col p-6">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="/basira-logo.svg"
            alt="Basira Logo"
            className="w-28 mb-3"
          />
          <h1 className="text-xl font-bold text-[#0A2A43]">
            منصة الأدمن
          </h1>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2">
          <NavLink to="/admin-dashboard" className={({ isActive }) => isActive ? active : inactive}>
            <FaHome /> الرئيسية
          </NavLink>

          <NavLink to="/admin-centers" className={({ isActive }) => isActive ? active : inactive}>
            <FaBuilding /> المراكز
          </NavLink>

          <NavLink to="/admin-doctors" className={({ isActive }) => isActive ? active : inactive}>
            <FaUserMd /> الأطباء
          </NavLink>

          <NavLink to="/admin-subscriptions" className={({ isActive }) => isActive ? active : inactive}>
            <FaCreditCard /> الاشتراكات
          </NavLink>

          <NavLink to="/admin-invoices" className={({ isActive }) => isActive ? active : inactive}>
            <FaFileInvoice /> الفواتير
          </NavLink>

          <NavLink to="/admin-analytics" className={({ isActive }) => isActive ? active : inactive}>
            <FaChartLine /> التحليلات
          </NavLink>

          <NavLink to="/admin-reports" className={({ isActive }) => isActive ? active : inactive}>
            <FaFileAlt /> التقارير
          </NavLink>

          <NavLink to="/admin-settings" className={({ isActive }) => isActive ? active : inactive}>
            <FaCog /> الإعدادات
          </NavLink>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 text-red-600 hover:bg-red-50 p-3 rounded-lg text-lg font-semibold"
        >
          <FaSignOutAlt /> تسجيل خروج
        </button>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* ===== Top Bar ===== */}
        <header className="bg-white rounded-2xl shadow-sm px-6 py-4 mb-8 flex items-center justify-between">

          {/* Title */}
          <h2 className="text-xl font-bold text-[#0A2A43]">
            {title}
          </h2>

          {/* Search */}
          <div className="relative w-full max-w-md mx-6">
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="بحث..."
              className="w-full border border-gray-200 rounded-xl py-2 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#135C8A]/30"
            />
          </div>

          {/* Notifications */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition">
            <FaBell className="text-[#135C8A]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
