import DoctorLayout from "../../layouts/DoctorLayout";
import { FaCheckCircle, FaEye, FaChartBar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function DoctorTestResult() {
  const navigate = useNavigate();
  const { testId } = useParams();

  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState("");

  /* ======================
     جلب نتيجة الذكاء الاصطناعي
  ====================== */
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/doctor/tests/${testId}/report`);
        // نتوقع aiResult محفوظ داخل test
        setAiResult(res.data?.aiResult || null);
      } catch (err) {
        console.error(err);
        setError("تعذر تحميل نتيجة الفحص");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [testId]);

  return (
    <DoctorLayout>
      <div className="max-w-3xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-center mb-8 text-[#0A2A43]">
          نتيجة فحص تتبع العين
        </h1>

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <div className="flex items-center gap-4 mb-4">
            <FaCheckCircle className="text-green-600" size={36} />
            <h2 className="text-2xl font-semibold text-[#135C8A]">
              تم إكمال الفحص بنجاح
            </h2>
          </div>

          <p className="text-gray-700 text-lg">
            تم تسجيل وتتبع حركة عين الطفل أثناء مشاهدة الفيديو.
          </p>

          {loading && (
            <p className="text-gray-500 mt-6">جاري تحليل بيانات الفحص...</p>
          )}

          {!loading && error && (
            <p className="text-red-500 mt-6">{error}</p>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

              {/* تركيز العين */}
              <div className="bg-[#EAF6FF] rounded-lg p-4 border">
                <div className="flex items-center gap-3 mb-2">
                  <FaEye className="text-[#135C8A]" />
                  <h3 className="font-semibold">تركيز العين</h3>
                </div>

                <p className="text-lg font-bold">
                  {aiResult?.confidence != null
                    ? `${Math.round(aiResult.confidence * 100)}%`
                    : "قيد التحليل"}
                </p>
              </div>

              {/* النتيجة العامة */}
              <div className="bg-[#EAF6FF] rounded-lg p-4 border">
                <div className="flex items-center gap-3 mb-2">
                  <FaChartBar className="text-[#135C8A]" />
                  <h3 className="font-semibold">النتيجة العامة</h3>
                </div>

                <p className="text-lg font-bold">
                  {aiResult?.label || "غير حاسمة"}
                </p>
              </div>

            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(`/doctor-report/${testId}`)}
            className="bg-[#135C8A] text-white px-8 py-3 rounded-lg"
          >
            عرض التقرير الكامل
          </button>

          <button
            onClick={() => navigate(`/doctor-notes/${testId}`)}
            className="bg-gray-200 px-8 py-3 rounded-lg"
          >
            إضافة ملاحظة
          </button>
        </div>

      </div>
    </DoctorLayout>
  );
}
