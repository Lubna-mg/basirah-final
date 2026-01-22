import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const itemClass = (path) =>
    `px-4 py-2 rounded-md font-medium ${
      location.pathname === path
        ? "bg-blue-700 text-white"
        : "text-white hover:bg-blue-600"
    }`;

  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen p-6 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center mb-6">لوحة الأدمن</h2>

      <Link to="/admin-dashboard" className={itemClass("/admin-dashboard")}>
        الرئيسية
      </Link>

      <Link to="/admin-centers" className={itemClass("/admin-centers")}>
        إدارة المراكز
      </Link>

      <Link
        to="/admin-subscriptions"
        className={itemClass("/admin-subscriptions")}
      >
        الاشتراكات
      </Link>

      <Link to="/admin-invoices" className={itemClass("/admin-invoices")}>
        الفواتير
      </Link>

      <Link to="/admin-reports" className={itemClass("/admin-reports")}>
        التقارير
      </Link>

      <Link to="/admin-settings" className={itemClass("/admin-settings")}>
        الإعدادات
      </Link>

      <a
        href="/admin"
        className="bg-red-600 text-white px-4 py-2 rounded-md mt-auto text-center hover:bg-red-700"
      >
        تسجيل خروج
      </a>
    </aside>
  );
}
