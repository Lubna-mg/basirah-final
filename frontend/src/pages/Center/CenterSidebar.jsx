import { Link } from "react-router-dom";

export default function CenterSidebar() {
  return (
    <aside className="w-64 bg-white shadow-md p-6 border-l flex flex-col gap-4">

      <h2 className="text-2xl font-bold text-teal-700 text-center mb-6">
        مركز — بصيرة
      </h2>

      <Link className="hover:bg-teal-100 px-4 py-2 rounded-md" to="/center-dashboard">
        الرئيسية
      </Link>

      <Link className="hover:bg-teal-100 px-4 py-2 rounded-md" to="/center-doctors">
        الأطباء
      </Link>

      <Link className="hover:bg-teal-100 px-4 py-2 rounded-md" to="/center-patients">
        المرضى
      </Link>

      <Link className="hover:bg-teal-100 px-4 py-2 rounded-md" to="/center-reports">
        الفحوصات
      </Link>

      <Link className="hover:bg-teal-100 px-4 py-2 rounded-md" to="/center-subscriptions">
        الاشتراك
      </Link>

      <Link className="hover:bg-teal-100 px-4 py-2 rounded-md" to="/center-settings">
        الإعدادات
      </Link>

      <a
        className="bg-red-600 text-white px-4 py-2 rounded-md mt-auto text-center hover:bg-red-700"
        href="/center"
      >
        تسجيل خروج
      </a>

    </aside>
  );
}
