// TODO: replace with real API later

export async function getPatientDetails(id) {
  return {
    patient: {
      id,
      name: "محمد علي",
      age: 6,
      gender: "ذكر",
      file_number: "P-0012",
      joined_at: "2025-01-10",
    },
    latest_scan: {
      id: 55,
      date: "2025-02-10",
      status: "completed",
      score: 82,
    },
    latest_note: {
      id: 99,
      text: "المريض يظهر تحسنًا ملحوظًا في التواصل البصري.",
      date: "2025-02-08",
    },
    history: {
      scans: [
        { id: 55, date: "2025-02-10", status: "completed" },
        { id: 41, date: "2025-01-28", status: "completed" },
      ],
      notes: [
        { id: 99, text: "...", date: "2025-02-08" },
        { id: 88, text: "...", date: "2025-01-15" },
      ],
    },
  };
}
