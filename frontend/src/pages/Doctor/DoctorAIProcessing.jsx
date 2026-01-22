import { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";

export default function DoctorAIProcessing() {
  const [progress, setProgress] = useState(0);

  // يحرك شريط التقدم + ينقلك تلقائي بعد التحليل
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2.5; // خلال 4 ثواني تقريباً
      });
    }, 100);

    const timer = setTimeout(() => {
      window.location.href = "/doctor-test-result";
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <DoctorLayout>
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">

        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#135C8A] mb-6"></div>

        <h1 className="text-3xl font-bold text-[#0A2A43] mb-4">
          يتم تحليل حركة العين...
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          الرجاء الانتظار قليلاً، يقوم النظام بمعالجة البيانات باستخدام الذكاء الاصطناعي.
        </p>

        {/* شريط التقدم */}
        <div className="w-80 bg-gray-200 rounded-full h-4 shadow-inner">
          <div
            className="bg-[#135C8A] h-4 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </DoctorLayout>
  );
}
