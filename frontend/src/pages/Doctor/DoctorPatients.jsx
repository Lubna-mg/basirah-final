import DoctorLayout from "../../layouts/DoctorLayout";
import { useState, useEffect } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getPatients } from "../../api/usePatients";

/* ===== Badge الحالة ===== */
function StatusBadge({ status }) {
  const map = {
    مكتمل: "bg-green-100 text-green-700",
    "قيد التحليل": "bg-yellow-100 text-yellow-700",
    "غير مكتمل": "bg-red-100 text-red-700",
    "لم يتم الفحص": "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        map[status] || map["لم يتم الفحص"]
      }`}
    >
      {status || "لم يتم الفحص"}
    </span>
  );
}

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();

  /* ===== جلب المرضى ===== */
  useEffect(() => {
    getPatients()
      .then((data) => setPatients(data))
      .catch(() => setPatients([]));
  }, []);

  /* ===== ترتيب ذكي ===== */
  const sortedPatients = [...patients].sort((a, b) => {
    const order = {
      "غير مكتمل": 1,
      "قيد التحليل": 2,
      مكتمل: 3,
    };
    return (order[a.lastScan] || 99) - (order[b.lastScan] || 99);
  });

  /* ===== فلترة + بحث (✅ هنا التعديل) ===== */
  const filtered = sortedPatients.filter((p) => {
    const q = search.trim().toLowerCase();

    if (!q) return true;

    const name = p.name?.toLowerCase() || "";
    const fileNumber = p.file_number?.toLowerCase() || "";

    const matchSearch =
      name.includes(q) || fileNumber.includes(q);

    const matchGender =
      filterGender === "all" ? true : filterGender === p.gender;

    const matchStatus =
      filterStatus === "all"
        ? true
        : filterStatus === (p.lastScan || "غير مكتمل");

    return matchSearch && matchGender && matchStatus;
  });

  /* ===== منطق الفحص ===== */
  const handleContinueScan = (patient) => {
    const status = patient.lastScan;

    if (status === "مكتمل") {
      navigate(`/doctor-report/${patient._id}`);
    } else {
      navigate(`/doctor-camera/${patient._id}`);
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#0A2A43] mb-8 text-center">
          قائمة المرضى
        </h1>

        {/* ===== البحث والفلاتر ===== */}
        <div className="bg-white p-6 rounded-xl shadow mb-10 space-y-6 border">
          <div className="relative">
            <FaSearch className="absolute left-4 top-4 text-gray-500" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو رقم الملف..."
              className="w-full p-4 pl-12 border rounded-lg text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="border p-3 rounded-lg"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
            >
              <option value="all">الجنس: الكل</option>
              <option value="male">ذكور</option>
              <option value="female">إناث</option>
            </select>

            <select
              className="border p-3 rounded-lg"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">حالة الفحص: الكل</option>
              <option value="مكتمل">مكتمل</option>
              <option value="قيد التحليل">قيد التحليل</option>
              <option value="غير مكتمل">غير مكتمل</option>
            </select>
          </div>
        </div>

        {/* ===== قائمة المرضى ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((patient) => {
            const status = patient.lastScan || "غير مكتمل";
            const actionLabel =
              status === "مكتمل" ? "فحص جديد" : "استكمال الفحص";

            return (
              <div
                key={patient._id}
                className="bg-white p-6 rounded-xl shadow-lg border"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#EAF6FF] p-4 rounded-full text-[#135C8A]">
                      <FaUser size={30} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#0A2A43]">
                        {patient.name}
                      </h2>
                      <p className="text-gray-600">
                        العمر: {patient.age} سنوات
                      </p>
                      <p className="text-gray-500 text-sm">
                        رقم الملف: {patient.file_number}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={status} />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <Link
                    to={`/doctor-patient/${patient._id}`}
                    className="bg-[#135C8A] text-white py-3 rounded-lg text-sm"
                  >
                    تفاصيل
                  </Link>

                  <button
                    onClick={() => handleContinueScan(patient)}
                    className="bg-[#74B3CE] text-white py-3 rounded-lg text-sm"
                  >
                    {actionLabel}
                  </button>

                  <Link
                    to={`/doctor-patient-notes/${patient._id}`}
                    className="bg-gray-200 text-[#0A2A43] py-3 rounded-lg text-sm"
                  >
                    ملاحظات
                  </Link>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 col-span-full text-lg">
              لا يوجد مرضى
            </p>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}
