import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import api from "../../api/axios";

export default function DoctorTestNotes() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [noteText, setNoteText] = useState("");
  const [recommendationText, setRecommendationText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveNote = async () => {
    if (!noteText.trim() && !recommendationText.trim()) return;

    try {
      setLoading(true);
      setError("");

      // ملاحظات الطبيب
      if (noteText.trim()) {
        await api.post(`/doctor/tests/${testId}/notes`, {
          text: noteText,
          type: "note",
        });
      }

      // التوصيات الطبية
      if (recommendationText.trim()) {
        await api.post(`/doctor/tests/${testId}/notes`, {
          text: recommendationText,
          type: "recommendation",
        });
      }

      // 👈 ننتقل للتقرير مع تحديد أننا جايين من الفحص
      navigate(`/doctor-report/${testId}?from=scan`);
    } catch (err) {
      console.error(err);
      setError("فشل حفظ الملاحظات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-[#0A2A43]">
          ملاحظات الفحص
        </h1>

        <p className="text-gray-500">
          يرجى تدوين ملاحظاتك الطبية والتوصيات لهذا الفحص
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white p-4 rounded-xl border space-y-4">

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="اكتب ملاحظات الطبيب هنا..."
            className="w-full border rounded-lg p-3 h-28"
          />

          <textarea
            value={recommendationText}
            onChange={(e) => setRecommendationText(e.target.value)}
            placeholder="اكتب التوصيات الطبية هنا..."
            className="w-full border rounded-lg p-3 h-28"
          />

          <button
            onClick={saveNote}
            disabled={loading}
            className="bg-[#135C8A] text-white px-6 py-2 rounded-lg"
          >
            {loading ? "جاري الحفظ..." : "حفظ الملاحظات"}
          </button>
        </div>
      </div>
    </DoctorLayout>
  );
}
