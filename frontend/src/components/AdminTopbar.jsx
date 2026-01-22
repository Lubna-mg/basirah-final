import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiBell, HiMagnifyingGlass } from "react-icons/hi2";
import api from "../services/api"; // عدّلي المسار إذا لزم

export default function AdminTopbar({ title }) {
  const navigate = useNavigate();

  /* ======================
     Search (مختصر)
  ====================== */
  const [q, setQ] = useState("");

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && q.trim()) {
      navigate(`/admin-centers?search=${encodeURIComponent(q.trim())}`);
      setQ("");
    }
  };

  /* ======================
     Notifications
  ====================== */
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/admin/notifications");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleNotifications = async () => {
    setOpen((v) => !v);

    if (!open && unreadCount > 0) {
      try {
        await api.put("/admin/notifications/read");
        setUnreadCount(0);
      } catch (err) {
        console.error("Failed to mark notifications as read");
      }
    }
  };

  return (
    <header className="h-[86px] bg-white border-b border-gray-200 flex items-center px-8 relative">
      {/* Left side */}
      <div className="flex-1 flex items-center gap-4">
        {/* Search */}
        <div className="relative w-[420px] max-w-full">
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <HiMagnifyingGlass className="text-xl" />
          </span>
          <input
            className="w-full h-[44px] rounded-xl border border-gray-200 bg-gray-50 pr-10 pl-4 outline-none focus:border-gray-300"
            placeholder="بحث عام (اضغط Enter)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {/* Bell */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="h-[44px] w-[44px] rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition relative"
          >
            <HiBell className="text-2xl text-slate-700" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {open && (
            <div className="absolute left-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
              <div className="p-3 border-b font-semibold text-slate-700 text-sm">
                الإشعارات
              </div>

              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-gray-400 text-center">
                  لا توجد إشعارات
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className="px-4 py-3 border-b last:border-none text-sm"
                  >
                    <p className="font-semibold text-[#0A2A43]">
                      {n.title}
                    </p>
                    <p className="text-gray-500">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side title */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">
            {title || "أهلاً أدمن"}
          </div>
        </div>
      </div>
    </header>
  );
}
