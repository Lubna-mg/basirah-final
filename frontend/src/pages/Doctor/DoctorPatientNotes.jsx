import DoctorLayout from "../../layouts/DoctorLayout";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function DoctorPatientNotes() {
  const { patientId } = useParams();

  /* ======================
     State
  ====================== */
  const [notes, setNotes] = useState([
    {
      _id: "1",
      text: "المريض يظهر تشتت أثناء الجلسات الصباحية",
      createdAt: "2026-01-08",
    },
    {
      _id: "2",
      text: "تحسن ملحوظ في التواصل البصري",
      createdAt: "2026-01-05",
    },
  ]);

  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState(null);

  /* ======================
     Handlers
  ====================== */
  const handleSave = () => {
    if (!newNote.trim()) return;

    if (editingId) {
      setNotes((prev) =>
        prev.map((n) =>
          n._id === editingId ? { ...n, text: newNote } : n
        )
      );
      setEditingId(null);
    } else {
      setNotes((prev) => [
        {
          _id: Date.now().toString(),
          text: newNote,
          createdAt: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ]);
    }

    setNewNote("");
  };

  const handleEdit = (note) => {
    setNewNote(note.text);
    setEditingId(note._id);
  };

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  /* ======================
     UI
  ====================== */
  return (
    <DoctorLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0A2A43]">
            ملاحظات المريض
          </h1>
          <p className="text-gray-500 text-sm">
            ملاحظات طبية عامة غير مرتبطة بفحص معيّن
          </p>
        </div>

        {/* Add / Edit Note */}
        <div className="bg-white border rounded-xl p-4 space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="اكتب الملاحظة الطبية هنا..."
            className="w-full h-28 border rounded-lg p-3"
          />

          <button
            onClick={handleSave}
            className="bg-[#135C8A] text-white px-6 py-2 rounded-lg"
          >
            {editingId ? "تحديث الملاحظة" : "حفظ الملاحظة"}
          </button>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 && (
            <p className="text-center text-gray-500">
              لا توجد ملاحظات بعد
            </p>
          )}

          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white border rounded-xl p-4 flex justify-between items-start"
            >
              <div>
                <p className="text-[#0A2A43]">{note.text}</p>
                <span className="text-xs text-gray-400">
                  {note.createdAt}
                </span>
              </div>

              <div className="flex gap-3 text-gray-500">
                <button onClick={() => handleEdit(note)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(note._id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
}
