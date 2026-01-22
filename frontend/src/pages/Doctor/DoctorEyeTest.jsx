import { useRef, useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";

export default function DoctorEyeTest() {
  const videoRef = useRef(null);      // الفيديو الخاص بالاختبار
  const cameraRef = useRef(null);     // كاميرا المستخدم
  const [step, setStep] = useState("intro");

  // تشغيل الكاميرا
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cameraRef.current) cameraRef.current.srcObject = stream;
      } catch (error) {
        console.log("Camera error:", error);
      }
    }
    startCamera();
  }, []);

  // بدء الفحص
  function startTest() {
    setStep("playing");
    videoRef.current.play();
  }

  // عند الانتهاء من الفيديو → ننتقل للنتيجة
  function handleVideoEnd() {
    window.location.href = "/doctor-test-result";
  }

  return (
    <DoctorLayout>
      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-center mb-8 text-[#0A2A43]">
          فحص تتبع العين
        </h1>

        {/* مقدمة */}
        {step === "intro" && (
          <div className="bg-white p-8 shadow rounded-xl text-center">
            <p className="text-lg text-gray-700 mb-6">
              سيظهر أمام الطفل فيديو قصير بينما يتم تتبع حركة العين باستخدام الكاميرا.
            </p>

            <button
              onClick={startTest}
              className="bg-[#135C8A] hover:bg-[#0F4A6E] text-white px-8 py-3 rounded-lg text-lg"
            >
              بدء الفحص
            </button>
          </div>
        )}

        {/* الفيديو + الكاميرا */}
        {step === "playing" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            {/* الفيديو */}
            <div className="md:col-span-2 bg-white p-4 rounded-xl shadow">
              <video
                ref={videoRef}
                onEnded={handleVideoEnd}
                className="w-full rounded-lg"
                src="/test-video.mp4"   // ⚠️ غيري الفيديو لاحقاً
                controls={false}
              ></video>
            </div>

            {/* الكاميرا */}
            <div className="md:col-span-2 bg-white p-4 rounded-xl shadow">
            <video
            ref={videoRef}
            onEnded={handleVideoEnd}
            className="w-full rounded-lg"
            src="/test-video.mp4"
            muted
           playsInline
         autoPlay
      ></video>
        </div>

          </div>
        )}

      </div>
    </DoctorLayout>
  );
}
