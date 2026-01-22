import CenterSidebar from "../components/CenterSidebar";
import CenterTopbar from "../components/CenterTopbar";

export default function CenterLayout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <CenterSidebar />

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <CenterTopbar title={title || "أهلاً بك"} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
