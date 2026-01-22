import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import {
  fetchNotifications,
  markNotificationsRead,
} from "../services/notifications";

export default function AdminNotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  const load = async () => {
    const res = await fetchNotifications();
    setItems(res.data.notifications);
    setUnread(res.data.unreadCount);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpen = async () => {
    setOpen(!open);
    if (!open && unread > 0) {
      await markNotificationsRead();
      setUnread(0);
    }
  };

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative">
        <FaBell className="text-xl text-[#0A2A43]" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-50">
          {items.length === 0 ? (
            <p className="p-4 text-sm text-gray-400 text-center">
              لا توجد إشعارات
            </p>
          ) : (
            items.map((n) => (
              <div
                key={n._id}
                className="px-4 py-3 border-b last:border-none text-sm"
              >
                <p className="font-semibold text-[#0A2A43]">{n.title}</p>
                <p className="text-gray-500">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
