import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= Protected ================= */
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

/* ================= Landing ================= */
import Landing from "./pages/Landing/Landing";

/* ================= Admin pages ================= */
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminCenters from "./pages/Admin/AdminCenters";
import AdminDoctors from "./pages/Admin/AdminDoctors";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminSubscriptions from "./pages/Admin/AdminSubscriptions";
import AdminBilling from "./pages/Admin/AdminBilling";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AdminActivity from "./pages/Admin/AdminActivity";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminReports from "./pages/Admin/AdminReports";
import AdminInvoices from "./pages/Admin/AdminInvoices";

/* ================= Center pages ================= */
import CenterLogin from "./pages/Center/CenterLogin";
import CenterDashboard from "./pages/Center/CenterDashboard";
import CenterDoctors from "./pages/Center/CenterDoctors";
import CenterPatients from "./pages/Center/CenterPatients";
import CenterAppointments from "./pages/Center/CenterAppointments";
import CenterReports from "./pages/Center/CenterReports";
import CenterSubscriptions from "./pages/Center/CenterSubscriptions";
import CenterSettings from "./pages/Center/CenterSettings";

/* ================= Doctor pages ================= */
import DoctorLogin from "./pages/Doctor/DoctorLogin";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorScans from "./pages/Doctor/DoctorScans";
import DoctorPatients from "./pages/Doctor/DoctorPatients";
import DoctorPatientDetails from "./pages/Doctor/DoctorPatientDetails";
import DoctorCameraTest from "./pages/Doctor/DoctorCameraTest";
import DoctorScanSession from "./pages/Doctor/DoctorScanSession";
import DoctorNotes from "./pages/Doctor/DoctorNotes";
import DoctorReport from "./pages/Doctor/DoctorReport";
import DoctorReports from "./pages/Doctor/DoctorReports";
import DoctorSettings from "./pages/Doctor/DoctorSettings";
import DoctorEyeTest from "./pages/Doctor/DoctorEyeTest";
import DoctorTestResult from "./pages/Doctor/DoctorTestResult";
import DoctorAIProcessing from "./pages/Doctor/DoctorAIProcessing";
import DoctorVideoRecorder from "./pages/Doctor/DoctorVideoRecorder";
import DoctorAddPatient from "./pages/Doctor/DoctorAddPatient";

/* ===== إضافاتك المهمة ===== */
import DoctorAddNote from "./pages/Doctor/DoctorAddNote";
import DoctorPatientNotes from "./pages/Doctor/DoctorPatientNotes";
import DoctorTestNotes from "./pages/Doctor/DoctorTestNotes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= Landing ================= */}
        <Route path="/" element={<Landing />} />

        {/* ================= Admin ================= */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/admin-centers" element={<ProtectedAdminRoute><AdminCenters /></ProtectedAdminRoute>} />
        <Route path="/admin-doctors" element={<ProtectedAdminRoute><AdminDoctors /></ProtectedAdminRoute>} />
        <Route path="/admin-users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
        <Route path="/admin-subscriptions" element={<ProtectedAdminRoute><AdminSubscriptions /></ProtectedAdminRoute>} />
        <Route path="/admin-billing" element={<ProtectedAdminRoute><AdminBilling /></ProtectedAdminRoute>} />
        <Route path="/admin-analytics" element={<ProtectedAdminRoute><AdminAnalytics /></ProtectedAdminRoute>} />
        <Route path="/admin-activity" element={<ProtectedAdminRoute><AdminActivity /></ProtectedAdminRoute>} />
        <Route path="/admin-settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />
        <Route path="/admin-reports" element={<ProtectedAdminRoute><AdminReports /></ProtectedAdminRoute>} />
        <Route path="/admin-invoices" element={<ProtectedAdminRoute><AdminInvoices /></ProtectedAdminRoute>} />

        {/* ================= Center ================= */}
        <Route path="/center" element={<CenterLogin />} />
        <Route path="/center-login" element={<Navigate to="/center" replace />} />
        <Route path="/center-dashboard" element={<CenterDashboard />} />
        <Route path="/center-doctors" element={<CenterDoctors />} />
        <Route path="/center-patients" element={<CenterPatients />} />
        <Route path="/center-appointments" element={<CenterAppointments />} />
        <Route path="/center-reports" element={<CenterReports />} />
        <Route path="/center-subscriptions" element={<CenterSubscriptions />} />
        <Route path="/center-settings" element={<CenterSettings />} />

        {/* ================= Doctor ================= */}
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor-scans" element={<DoctorScans />} />
        <Route path="/doctor-patients" element={<DoctorPatients />} />
        <Route path="/doctor-patient/:id" element={<DoctorPatientDetails />} />

        <Route path="/doctor-camera" element={<DoctorCameraTest />} />
        <Route path="/doctor-camera/:patientId" element={<DoctorCameraTest />} />

        <Route path="/doctor-scan-session/:patientId" element={<DoctorScanSession />} />

        {/* ===== Notes ===== */}
        <Route path="/doctor-notes" element={<DoctorNotes />} />
        <Route path="/doctor-notes/:patientId" element={<DoctorNotes />} />
        <Route path="/doctor-add-note" element={<DoctorAddNote />} />
        <Route path="/doctor-patient-notes/:patientId" element={<DoctorPatientNotes />} />
        <Route path="/doctor-test-notes/:testId" element={<DoctorTestNotes />} />

        {/* ===== Reports ===== */}
        <Route path="/doctor-report/:testId" element={<DoctorReport />} />
        <Route path="/doctor-reports" element={<DoctorReports />} />

        {/* ===== Others ===== */}
        <Route path="/doctor-settings" element={<DoctorSettings />} />
        <Route path="/doctor-eye-test" element={<DoctorEyeTest />} />
        <Route path="/doctor-test-result" element={<DoctorTestResult />} />
        <Route path="/doctor-ai-processing" element={<DoctorAIProcessing />} />
        <Route path="/doctor-video-record" element={<DoctorVideoRecorder />} />
        <Route path="/doctor-add-patient" element={<DoctorAddPatient />} />

        {/* ================= Fallback ================= */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
