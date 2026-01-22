import DoctorLayout from "../../layouts/DoctorLayout";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import html2pdf from "html2pdf.js";

/* ===== Chart.js ===== */
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ===== Gaze Pie Chart ===== */
function GazeChart({ stats }) {
  if (!stats) return null;

  const data = {
    labels: ["المنتصف", "اليسار", "اليمين"],
    datasets: [
      {
        data: [
          stats.center || 0,
          stats.left || 0,
          stats.right || 0,
        ],
        backgroundColor: ["#135C8A", "#4CAF50", "#FF9800"],
      },
    ],
  };

  return (
    <div className="max-w-sm mx-auto">
      <Pie data={data} />
    </div>
  );
}

export default function DoctorReport() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const fromScan = searchParams.get("from") === "scan";

  const [report, setReport] = useState(null);
  const [notes, setNotes] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);

  /* ===== تحميل PDF ===== */
  const downloadPDF = () => {
    const element = document.getElementById("report-content");
    if (!element) return;

    html2pdf()
      .set({
        margin: 10,
        filename: "basira-medical-report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  /* ===== جلب التقرير ===== */
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/doctor/tests/${testId}/report`);
        const data = res.data;

        setReport(data);

        setNotes(data?.notes?.filter(n => n.type === "note") || []);
        setRecommendations(
          data?.notes
            ?.filter(n => n.type === "recommendation")
            .map(r => r.text) || []
        );

        setAiSummary(
          data?.aiSummary ||
          "تم تحليل بيانات تتبع العين باستخدام نموذج ذكاء اصطناعي مدرّب على أنماط حركة العين."
        );

        setStatus(data?.status || "draft");
      } catch (err) {
        console.error("فشل تحميل التقرير", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [testId]);

  const saveDraft = () => {
    setStatus("draft");
    alert("تم حفظ التقرير كمسودة 📝");
  };

  const approveReport = async () => {
    try {
      await api.patch(`/doctor/tests/${testId}/approve`);
      setStatus("approved");
      alert("تم اعتماد التقرير الطبي رسميًا ✅");
      navigate("/doctor-reports");
    } catch (err) {
      console.error(err);
      alert("فشل اعتماد التقرير ❌");
    }
  };

  if (loading) {
    return (
      <DoctorLayout>
        <p className="text-center mt-20 text-gray-500">
          جاري تحميل التقرير الطبي...
        </p>
      </DoctorLayout>
    );
  }

  if (!report) {
    return (
      <DoctorLayout>
        <p className="text-center mt-20 text-red-500">
          تعذر تحميل التقرير الطبي
        </p>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        <div
          id="report-content"
          className="bg-white rounded-xl border p-8 space-y-8"
        >

          {/* ===== الهيدر ===== */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <img src="/basira-logo.svg" alt="Basira Logo" className="h-12" />
              <p className="text-sm font-semibold text-[#0A2A43]">
                منصة بصيرة الطبية
              </p>
              <p className="text-xs text-gray-500">Basira Medical Platform</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-[#0A2A43]">
            التقرير الطبي – فحص تتبع العين
          </h1>

          {/* ===== بيانات المريض ===== */}
          {report.patient && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>اسم المريض:</strong> {report.patient.name}</p>
              <p><strong>العمر:</strong> {report.patient.age || "—"}</p>
              <p><strong>رقم الملف:</strong> {report.patient.file_number}</p>
              <p><strong>نوع الفحص:</strong> تتبع العين</p>
              <p><strong>الطبيب المشرف:</strong> {report.doctor?.name}</p>
              <p>
                <strong>تاريخ التقرير:</strong>{" "}
                {new Date(report.createdAt).toLocaleDateString("ar-SA")}
              </p>
            </div>
          )}

          <hr />

          {/* ===== ملاحظات الطبيب ===== */}
          <div>
            <h2 className="font-bold mb-2">ملاحظات الطبيب</h2>
            {notes.length ? (
              <ul className="list-disc pr-5 space-y-1">
                {notes.map((n, i) => <li key={i}>{n.text}</li>)}
              </ul>
            ) : (
              <p className="text-gray-400">لا توجد ملاحظات.</p>
            )}
          </div>

          <hr />

          {/* ===== ملخص الذكاء الاصطناعي ===== */}
          <div>
            <h2 className="font-bold mb-2">ملخص الذكاء الاصطناعي</h2>
            <p className="text-gray-700">{aiSummary}</p>
          </div>

          <hr />

          {/* ===== Heatmap ===== */}
          <div>
            <h2 className="font-bold mb-2">خريطة تركيز النظر</h2>
            {report.aiResult?.heatmapImage ? (
              <img
                src={report.aiResult.heatmapImage}
                alt="Gaze Heatmap"
                className="w-full rounded-lg border"
              />
            ) : (
              <p className="text-gray-400 text-sm">
                لم يتم توليد خريطة تركيز النظر لعدم اكتمال بيانات الفحص.
              </p>
            )}
          </div>

          <hr />

          {/* ===== الرسم البياني ===== */}
          <div>
            <h2 className="font-bold mb-4">تحليل توزيع النظر</h2>
            {report.aiResult?.gazeStats &&
             (report.aiResult.gazeStats.center > 0 ||
              report.aiResult.gazeStats.left > 0 ||
              report.aiResult.gazeStats.right > 0) ? (
              <GazeChart stats={report.aiResult.gazeStats} />
            ) : (
              <p className="text-gray-400 text-sm">
                لم يتم عرض الرسم البياني لعدم توفر بيانات كافية من تتبع العين.
              </p>
            )}
          </div>

          <hr />

          {/* ===== التوصيات ===== */}
          <div>
            <h2 className="font-bold mb-2">التوصيات الطبية</h2>
            {recommendations.length ? (
              <ul className="list-disc pr-5 space-y-1">
                {recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            ) : (
              <p className="text-gray-400">لا توجد توصيات.</p>
            )}
          </div>

          {/* ===== التنويه الطبي ===== */}
<div className="mt-10 pt-4 border-t text-xs text-gray-500 leading-relaxed">
  <p className="font-semibold mb-1">
    تنويه طبي:
  </p>
  <p>
    لا يُعد هذا التقرير تشخيصًا طبيًا نهائيًا، ولا يُغني عن التقييم السريري
    المباشر من قبل الطبيب المختص، وإنما يُستخدم كأداة تحليل مساعدة لدعم
    القرار الطبي.
  </p>
  <p className="mt-1">
    تعتمد نتائج التقرير على جودة واكتمال بيانات الفحص، ويجب تفسيرها ضمن
    السياق السريري الكامل للحالة.
  </p>
</div>


        </div>

        {/* ===== الأزرار ===== */}
        <div className="flex gap-4 items-center">
          <button
            onClick={downloadPDF}
            className="bg-[#135C8A] text-white px-6 py-2 rounded-lg font-semibold"
          >
            تحميل PDF
          </button>

          {fromScan && (
            <>
              <button
                onClick={saveDraft}
                className="bg-gray-200 px-6 py-2 rounded-lg font-semibold"
              >
                حفظ كمسودة
              </button>

              <button
                onClick={approveReport}
                className="bg-[#135C8A] text-white px-6 py-2 rounded-lg font-semibold"
              >
                اعتماد التقرير
              </button>

              <p className="text-sm text-gray-500">
                حالة التقرير: {status === "approved" ? "معتمد" : "مسودة"}
              </p>
            </>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}
