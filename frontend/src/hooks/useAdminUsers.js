// src/hooks/useAdminUsers.js
import { useState, useEffect } from "react";

export function useAdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/admin/admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "فشل تحميل حسابات المشرفين");
      }

      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("غير مسموح – لا يوجد توكن أدمن");
      return;
    }
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createAdmin = async ({ name, email, password, role }) => {
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "فشل إنشاء الحساب");
    }

    await fetchAdmins();
  };

  const updateAdmin = async (id, payload) => {
    const res = await fetch(`/api/admin/admins/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "فشل تحديث الحساب");
    }

    await fetchAdmins();
  };

  const resetAdminPassword = async (id, newPassword) => {
    const res = await fetch(`/api/admin/admins/${id}/reset-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "فشل تحديث كلمة المرور");
    }
  };

  const deleteAdmin = async (id) => {
    const res = await fetch(`/api/admin/admins/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "فشل حذف الحساب");
    }

    await fetchAdmins();
  };

  return {
    admins,
    loading,
    error,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    resetAdminPassword,
    refetch: fetchAdmins,
  };
}
