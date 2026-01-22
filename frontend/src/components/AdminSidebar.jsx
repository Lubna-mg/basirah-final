import { NavLink, useNavigate } from "react-router-dom";
import {
  HiSquares2X2,
  HiBuildingOffice2,
  HiUserGroup,
  HiCreditCard,
  HiDocumentText,
  HiChartBarSquare,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

const navItems = [
  { to: "/admin-dashboard", label: "الرئيسية", icon: HiSquares2X2 },
  { to: "/admin-centers", label: "المراكز", icon: HiBuildingOffice2 },
  { to: "/admin-doctors", label: "الأطباء", icon: HiUserGroup },
  { to: "/admin-subscriptions", label: "الاشتراكات", icon: HiCreditCard },
  { to: "/admin-invoices", label: "الفواتير", icon: HiDocumentText },
  { to: "/admin-analytics", label: "التحليلات", icon: HiChartBarSquare },
  { to: "/admin-reports", label: "التقارير", icon: HiDocumentText },
  { to: "/admin-settings", label: "الاعدادات", icon: HiCog6Tooth },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin-login", { replace: true });
  };

  const baseLink =
    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition text-[18px]";

  return (
    <aside className="w-[320px] min-h-screen bg-white border-l border-gray-200 px-6 py-6 flex flex-col" dir="rtl">
      {/* Logo / Brand */}
      <div className="flex items-center justify-center flex-col gap-2 mb-6">
        {/* بدّلي اللوجو بصورة من assets لو عندك */}
        <div className="text-3xl font-bold text-slate-800">بصيرة</div>
        <div className="text-sm text-gray-500">منصة الأدمن</div>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-2 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? `${baseLink} bg-[#0f2a4d] text-white shadow`
                  : `${baseLink} text-slate-700 hover:bg-gray-50`
              }
              end
            >
              {/* يتم تغيير ترتيب الأيقونات والنصوص عند الـ RTL */}
              <span className="flex items-center gap-3">
                <Icon className="text-2xl" />
                <span className="font-medium">{item.label}</span>
              </span>

              {/* الأيقونة الصغيرة (إن كنت بحاجة إليها) */}
              <span className="opacity-70"> </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-[18px] text-slate-800 hover:bg-red-50 transition"
      >
        <span className="flex items-center gap-3">
          <HiArrowRightOnRectangle className="text-2xl text-red-600" />
          <span className="font-medium">تسجيل خروج</span>
        </span>
      </button>
    </aside>
  );
}
