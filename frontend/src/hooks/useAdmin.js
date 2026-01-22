// src/hooks/useAdmin.js
import { useEffect, useState } from "react";

export default function useAdmin(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        const res = await fetcher();
        if (mounted) setData(res.data);
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.message || "حدث خطأ غير متوقع"
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading, error };
}
