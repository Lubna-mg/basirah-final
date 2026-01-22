import Test from "../../models/Test.js";
import mongoose from "mongoose";

/**
 * ===============================
 * جلب جميع ملاحظات الطبيب (قديمة)
 * GET /api/v1/doctor/notes
 * ===============================
 */
export const getDoctorNotes = async (req, res) => {
  try {
    const tests = await Test.find({
      doctor: req.doctor._id,
      notes: { $exists: true, $ne: [] },
    })
      .populate("patient", "name")
      .sort({ createdAt: -1 });

    const notes = [];

    tests.forEach((test) => {
      if (!Array.isArray(test.notes)) return;

      test.notes.forEach((note) => {
        if (!note || !note.text) return;

        notes.push({
          _id: note._id,
          text: note.text,
          createdAt: note.createdAt,
          patient: test.patient,
          testId: test._id,
        });
      });
    });

    res.json(notes);
  } catch (error) {
    console.error("getDoctorNotes error:", error);
    res.status(500).json({ message: "فشل تحميل الملاحظات" });
  }
};

/**
 * ===============================
 * 🆕 جلب ملاحظات مريض معيّن
 * GET /api/v1/doctor/notes/patient/:patientId
 * ===============================
 */
export const getDoctorNotesByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.json([]);
    }

    const tests = await Test.find({
      doctor: req.doctor._id,
      patient: patientId,
      notes: { $exists: true, $ne: [] },
    }).sort({ createdAt: -1 });

    const notes = [];

    tests.forEach((test) => {
      test.notes.forEach((note) => {
        if (!note || !note.text) return;

        notes.push({
          _id: note._id,
          text: note.text,
          createdAt: note.createdAt,
          testId: test._id,
        });
      });
    });

    res.json(notes);
  } catch (error) {
    console.error("getDoctorNotesByPatient error:", error);
    res.status(500).json({ message: "فشل تحميل ملاحظات المريض" });
  }
};

/**
 * ===============================
 * إضافة ملاحظة على فحص (قديمة)
 * POST /api/v1/doctor/notes/:testId
 * ===============================
 */
export const addNoteToTest = async (req, res) => {
  try {
    const { text } = req.body;
    const { testId } = req.params;

    if (!text) {
      return res.status(400).json({ message: "نص الملاحظة مطلوب" });
    }

    const test = await Test.findOne({
      _id: testId,
      doctor: req.doctor._id,
    });

    if (!test) {
      return res.status(404).json({ message: "الفحص غير موجود" });
    }

    const note = {
      text,
      createdAt: new Date(),
    };

    test.notes.unshift(note);
    await test.save();

    res.status(201).json(note);
  } catch (error) {
    console.error("addNoteToTest error:", error);
    res.status(500).json({ message: "فشل إضافة الملاحظة" });
  }
};

/**
 * ===============================
 * 🆕 إضافة ملاحظة لمريض (صفحتك)
 * POST /api/v1/doctor/notes/patient/:patientId
 * ===============================
 */
export const addNoteToPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "نص الملاحظة مطلوب" });
    }

    const test = await Test.findOne({
      doctor: req.doctor._id,
      patient: patientId,
    }).sort({ createdAt: -1 });

    if (!test) {
      return res.status(404).json({ message: "لا يوجد فحص مرتبط بالمريض" });
    }

    const note = {
      text,
      createdAt: new Date(),
    };

    test.notes.unshift(note);
    await test.save();

    res.status(201).json(note);
  } catch (error) {
    console.error("addNoteToPatient error:", error);
    res.status(500).json({ message: "فشل حفظ الملاحظة" });
  }
};

/**
 * ===============================
 * جلب فحوصات الطبيب
 * GET /api/v1/doctor/tests
 * ===============================
 */
export const getMyTests = async (req, res) => {
  try {
    const tests = await Test.find({
      doctor: req.doctor._id,
    })
      .populate("patient", "name")
      .sort({ createdAt: -1 });

    res.json(tests);
  } catch (error) {
    console.error("getMyTests error:", error);
    res.status(500).json({ message: "فشل تحميل الفحوصات" });
  }
};

/**
 * ===============================
 * تقرير فحص واحد
 * GET /api/v1/doctor/tests/:id
 * ===============================
 */
export const getTestReport = async (req, res) => {
  try {
    const test = await Test.findOne({
      _id: req.params.id,
      doctor: req.doctor._id,
    }).populate("patient", "name");

    if (!test) {
      return res.status(404).json({ message: "الفحص غير موجود" });
    }

    res.json(test);
  } catch (error) {
    console.error("getTestReport error:", error);
    res.status(500).json({ message: "فشل تحميل التقرير" });
  }
};
