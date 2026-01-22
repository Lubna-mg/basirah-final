import DoctorLayout from "../../layouts/DoctorLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";

export default function DoctorAddNote() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveNote = async () => {
    if (!text.trim()) {
      setError("الرجاء كتابة الملاحظة");
      return;
    }

    try {
      setLoading(true);
      await api.patch(`/doctor/tests/${testId}/notes`, { text });

      // تحديث حالة الفحص إلى notes (اختياري)
      navigate(`/doctor-report/${testId}`);
    } catch (err) {
      console.error(err);
      setError("فشل حفظ الملاحظة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        <h1 className="text-3xl font-bold text-[#0A2A43]">
          إضافة ملاحظة طبية
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب الملاحظة الطبية هنا..."
          className="w-full border rounded-xl p-4"
        />

        <button
          onClick={saveNote}
          disabled={loading}
          className="bg-[#135C8A] text-white px-6 py-3 rounded-lg"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ الملاحظة والانتقال للتقرير"}
        </button>

      </div>
    </DoctorLayout>
  );
}
