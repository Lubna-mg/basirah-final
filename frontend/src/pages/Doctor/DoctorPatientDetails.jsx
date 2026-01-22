import DoctorLayout from "../../layouts/DoctorLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function DoctorPatientDetails() {
  const { id } = useParams(); // patientId
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [tests, setTests] = useState([]); // ✅ فحوصات المريض
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     جلب بيانات المريض
  ========================= */
  useEffect(() => {
    async function fetchPatient() {
      try {
        const res = await api.get(`/doctor/patients/${id}`);
        setPatient(res.data);
      } catch (err) {
        console.error(err);
        setError("لم يتم العثور على بيانات المريض");
      }
    }

    fetchPatient();
  }, [id]);

  /* =========================
     جلب فحوصات المريض
  ========================= */
  useEffect(() => {
    async function fetchTests() {
      try {
        const res = await api.get(`/doctor/tests/patient/${id}`);
        setTests(res.data);
      } catch (err) {
        console.error("فشل تحميل الفحوصات");
      } finally {
        setLoading(false);
      }
    }

    fetchTests();
  }, [id]);

  if (loading) {
    return (
      <DoctorLayout>
        <p className="text-center mt-20">جارٍ التحميل...</p>
      </DoctorLayout>
    );
  }

  if (error) {
    return (
      <DoctorLayout>
        <p className="text-center mt-20 text-red-600">{error}</p>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-10">
        <h1 className="text-3xl font-bold text-[#0A2A43] text-center">
          تفاصيل المريض
        </h1>

        {/* 🧾 بيانات المريض */}
        <div className="bg-white border rounded-xl shadow p-6 space-y-3">
          <p><strong>الاسم:</strong> {patient.name}</p>
          <p><strong>العمر:</strong> {patient.age} سنوات</p>
          <p>
            <strong>الجنس:</strong>{" "}
            {patient.gender === "male" ? "ذكر" : "أنثى"}
          </p>
          <p><strong>رقم الملف:</strong> {patient.file_number}</p>

          <p className="text-gray-500 text-sm">
            تاريخ الإضافة:{" "}
            {new Date(patient.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* 🩺 سجل الفحوصات */}
        <div className="bg-white border rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-[#0A2A43] mb-4">
            سجل الفحوصات
          </h2>

          {tests.length > 0 ? (
            <ul className="space-y-3">
              {tests.map((test, index) => (
                <li
                  key={test._id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">
                      فحص تتبع العين #{tests.length - index}
                    </p>
                    <p className="text-sm text-gray-500">
                      التاريخ:{" "}
                      {new Date(test.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      المدة: {test.duration} ثانية
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        test.status === "scanned"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {test.status === "scanned"
                        ? "مكتمل"
                        : "غير مكتمل"}
                    </span>

                    <button
                      onClick={() =>
                        navigate(`/doctor-report/${test._id}`)
                      }
                      className="text-[#135C8A] font-semibold hover:underline"
                    >
                      عرض التقرير
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              لا توجد فحوصات سابقة لهذا المريض.
            </p>
          )}
        </div>

        {/* ▶️ بدء فحص جديد */}
        <div className="text-center">
          <button
            onClick={() => navigate(`/doctor-camera/${id}`)}
            className="bg-[#135C8A] hover:bg-[#0F4A6D] text-white px-8 py-3 rounded-lg text-lg"
          >
            بدء فحص جديد
          </button>
        </div>
      </div>
    </DoctorLayout>
  );
}
