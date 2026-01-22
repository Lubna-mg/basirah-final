import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DoctorLayout from "../../layouts/DoctorLayout";
import api from "../../api/axios";

export default function DoctorCameraTest() {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraError, setCameraError] = useState("");
  const [uiError, setUiError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);

  const [patientName, setPatientName] = useState("");

  /* ======================
     تشغيل الكاميرا
  ====================== */
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch {
        setCameraError("تعذّر تشغيل الكاميرا. يرجى السماح بالوصول.");
        setCameraReady(false);
      }
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  /* ======================
     جلب اسم المريض (شكلي فقط)
  ====================== */
  useEffect(() => {
    if (!patientId) return;

    async function fetchPatientName() {
      try {
        const res = await api.get(`/doctor/patients/${patientId}`);
        setPatientName(res.data.name || "");
      } catch {
        setPatientName("");
      }
    }

    fetchPatientName();
  }, [patientId]);

  /* ======================
     الانتقال للفحص
  ====================== */
  const handleGoToScan = () => {
    setUiError("");

    if (!patientId) {
      setUiError("يرجى اختيار مريض قبل بدء الفحص.");
      return;
    }

    if (!cameraReady) {
      setUiError("تأكد من تشغيل الكاميرا قبل المتابعة.");
      return;
    }

    navigate(`/doctor-scan-session/${patientId}`);
  };

  return (
    <DoctorLayout>
      <div className="max-w-4xl mx-auto p-6 text-center space-y-6">

        {/* العنوان */}
        <div>
          <h1 className="text-3xl font-bold text-[#0A2A43] mb-2">
            اختبار الكاميرا
          </h1>
          <p className="text-gray-600">
            هذه الخطوة للتأكد من جاهزية الكاميرا قبل بدء الفحص.
          </p>
        </div>

        {/* تنبيه اختيار مريض */}
        {!patientId && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg">
            يرجى اختيار مريض قبل بدء الفحص.
          </div>
        )}

        {/* بيانات المريض (فقط إذا موجود) */}
        {patientId && (
          <div className="bg-white rounded-xl shadow border p-4 max-w-md mx-auto">
            <p className="text-sm text-gray-500 mb-1">اسم المريض : </p>
            <p className="text-lg font-bold text-[#0A2A43]">
              {patientName || "—"}
            </p>

            <div className="flex items-center justify-center gap-2 mt-2 text-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  cameraReady ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span className="text-gray-600">
                {cameraReady ? "الكاميرا جاهزة" : "الكاميرا غير جاهزة"}
              </span>
            </div>
          </div>
        )}

        {/* أخطاء */}
        {uiError && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg">
            {uiError}
          </div>
        )}

        {cameraError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg">
            {cameraError}
          </div>
        )}

        {/* معاينة الكاميرا */}
        <div className="flex justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-56 h-40 rounded-xl border shadow object-cover"
          />
        </div>

        {/* زر الانتقال */}
        <button
          onClick={handleGoToScan}
          disabled={!cameraReady || !patientId}
          className={`px-10 py-3 rounded-xl text-lg font-semibold transition
            ${
              cameraReady && patientId
                ? "bg-[#135C8A] hover:bg-[#0F4A6D] text-white"
                : "bg-gray-400 cursor-not-allowed text-white"
            }`}
        >
          الانتقال للفحص
        </button>

      </div>
    </DoctorLayout>
  );
}
