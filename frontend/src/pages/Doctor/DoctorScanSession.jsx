import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DoctorLayout from "../../layouts/DoctorLayout";
import api from "../../api/axios";

export default function DoctorScanSession() {
  /* ======================
     Router
  ====================== */
  const { patientId } = useParams();
  const navigate = useNavigate();

  /* ======================
     Refs
  ====================== */
  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const currentTestIdRef = useRef(null); // ✅ مهم جدًا

  /* ======================
     State
  ====================== */
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(210);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [capturedImages, setCapturedImages] = useState([]);

  /* ======================
     تحقق من patientId
  ====================== */
  useEffect(() => {
    if (!patientId) {
      setError("معرّف المريض غير موجود");
    }
  }, [patientId]);

  /* ======================
     تشغيل الكاميرا
  ====================== */
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
        }
      } catch {
        setError("تعذّر تشغيل الكاميرا");
      }
    }

    startCamera();

    return () => {
      if (cameraRef.current?.srcObject) {
        cameraRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  /* ======================
     التايمر
  ====================== */
  useEffect(() => {
    if (!hasStarted || isPaused || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, isPaused, timer]);

  useEffect(() => {
    if (timer === 0 && hasStarted) {
      finishTest(false);
    }
  }, [timer, hasStarted]);

  /* ======================
     رفع صورة واحدة للسيرفر
  ====================== */
  const uploadFrame = async (imageBase64) => {
    if (!currentTestIdRef.current) return;

    try {
      const blob = await (await fetch(imageBase64)).blob();
      const formData = new FormData();
      formData.append("frame", blob, `frame_${Date.now()}.jpg`);

      await api.post(
        `/doctor/tests/${currentTestIdRef.current}/frames`,
        formData
        // ✅ FIX: لا نضع Content-Type يدويًا
      );
    } catch (err) {
      console.error(
        "❌ Failed to upload frame",
        err.response?.data || err.message
      );
    }
  };

  /* ======================
     التقاط الصور (كل ثانية)
  ====================== */
  const captureFrame = () => {
    if (!cameraRef.current || !canvasRef.current) return;

    const video = cameraRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL("image/jpeg", 0.7);

    setCapturedImages((prev) => [...prev, imageBase64]);

    uploadFrame(imageBase64); // ✅ الآن ترفع فعليًا
  };

  const startCapturing = () => {
    captureIntervalRef.current = setInterval(captureFrame, 1000);
  };

  const stopCapturing = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  };

  /* ======================
     التحكم بالفحص
  ====================== */
  const startTest = async () => {
    try {
      setHasStarted(true);
      videoRef.current?.play();

      const payload = {
        patientId,
        type: "eye_tracking",
        status: "scanned",
        duration: 0,
        stoppedEarly: false,
      };

      const res = await api.post("/doctor/tests", payload);
      currentTestIdRef.current = res.data._id;

      startCapturing();
    } catch (err) {
      console.error(err);
      setError("تعذّر بدء الفحص");
    }
  };

  const pauseTest = () => {
    setIsPaused(true);
    videoRef.current?.pause();
    stopCapturing();
  };

  const resumeTest = () => {
    setIsPaused(false);
    videoRef.current?.play();
    startCapturing();
  };

  /* ======================
     إنهاء الفحص
  ====================== */
  const finishTest = async () => {
    try {
      setLoading(true);
      stopCapturing();
      navigate(`/doctor-test-notes/${currentTestIdRef.current}`);
    } catch (err) {
      setError("تعذّر إنهاء الفحص");
    } finally {
      setLoading(false);
    }
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <DoctorLayout>
      <div className="max-w-5xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-2 text-[#0A2A43]">
          فحص تتبع العين
        </h1>

        <p className="text-gray-600 mb-6 text-sm">
          يرجى ترك الطفل يشاهد المقطع بهدوء دون توجيهه.
        </p>

        {error && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-4">
          <video
            ref={cameraRef}
            autoPlay
            muted
            playsInline
            className="w-24 h-24 rounded-full border shadow opacity-60"
          />
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <video
            ref={videoRef}
            src="/autism-eye-video.mp4"
            playsInline
            muted
            className="w-full rounded-lg"
          />
        </div>

        {hasStarted && (
          <p className="text-gray-600 text-sm mb-4">
            الوقت المتبقي: {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        )}

        {!hasStarted ? (
          <button
            onClick={startTest}
            className="bg-[#135C8A] text-white px-8 py-3 rounded-lg"
          >
            بدء الفحص
          </button>
        ) : (
          <div className="flex justify-center gap-4">
            {!isPaused ? (
              <button
                onClick={pauseTest}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                إيقاف الفحص
              </button>
            ) : (
              <button
                onClick={resumeTest}
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                استكمال الفحص
              </button>
            )}

            <button
              onClick={finishTest}
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              {loading ? "جارٍ الحفظ..." : "إنهاء الفحص"}
            </button>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
