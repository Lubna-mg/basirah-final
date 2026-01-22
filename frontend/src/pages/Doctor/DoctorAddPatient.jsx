import DoctorLayout from "../../layouts/DoctorLayout";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function DoctorAddPatient() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return name.trim() && age && Number(age) > 0;
  }, [name, age]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("تأكدي من تعبئة الاسم + العمر");
      return;
    }

    try {
      setLoading(true);

      await api.post("/doctor/patients", {
        name: name.trim(),
        age: Number(age),
        gender,
      });

      navigate("/doctor-patients");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "حدث خطأ أثناء إضافة المريض");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-[#0A2A43] mb-8 text-center">
          إضافة مريض
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="bg-white border rounded-xl shadow p-6 space-y-5">
          <div>
            <label className="block mb-2 font-semibold">اسم المريض</label>
            <input
              className="w-full border rounded-lg p-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: محمد علي"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">العمر</label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              className="w-full border rounded-lg p-3"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="مثال: 6"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">الجنس</label>
            <select
              className="w-full border rounded-lg p-3"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full bg-[#135C8A] text-white py-3 rounded-lg"
          >
            {loading ? "جارٍ الحفظ..." : "حفظ"}
          </button>
        </form>
      </div>
    </DoctorLayout>
  );
}
