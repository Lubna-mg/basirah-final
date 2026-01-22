import Notification from "../../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
      notifications,
      unreadCount,
    });
  } catch (err) {
    res.status(500).json({ message: "فشل تحميل الإشعارات" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: "فشل تحديث الإشعارات" });
  }
};
