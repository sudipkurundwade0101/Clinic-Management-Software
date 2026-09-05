import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AppSidebar } from '@/components/app_sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Stethoscope } from 'lucide-react';

// Lazy loading pages for optimal initial bundle loading performance
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const ReportsPage = lazy(() => import('@/pages/Reports'));
const AppointmentsPage = lazy(() => import('@/pages/Appointments'));
const PatientsPage = lazy(() => import('@/pages/Patients'));
const ConsultationPage = lazy(() => import('@/pages/Consultation'));
const PrescriptionPage = lazy(() => import('@/pages/Prescription'));
const DoctorsPage = lazy(() => import('@/pages/Doctors'));
const MedicalRecordsPage = lazy(() => import('@/pages/MedicalRecords'));
const BillingPage = lazy(() => import('@/pages/Billing'));
const SettingsPage = lazy(() => import('@/pages/Settings'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
const LoginPage = lazy(() => import('@/pages/Login'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

// Production-ready Loading Fallback Component
const PageLoadingFallback: React.FC = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-3">
    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center animate-pulse">
      <Stethoscope className="size-6 animate-spin" />
    </div>
    <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading MediCare Portal...</p>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* Unauthenticated / Standalone Public Routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Authenticated Protected Shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppSidebar />}>
            {/* Redirect root '/' to '/dashboard' */}
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
            <Route path={ROUTES.APPOINTMENTS} element={<AppointmentsPage />} />
            <Route path={ROUTES.PATIENTS} element={<PatientsPage />} />
            <Route path={`${ROUTES.PATIENTS}/:patientId`} element={<PatientsPage />} />
            <Route path={`${ROUTES.PATIENTS}/:patientId/consultation/new`} element={<ConsultationPage />} />
            <Route path={`${ROUTES.PATIENTS}/:patientId/consultation/:consultationId/edit`} element={<ConsultationPage />} />
            <Route path={`${ROUTES.PATIENTS}/:patientId/prescriptions/new`} element={<PrescriptionPage />} />
            <Route path={`${ROUTES.PATIENTS}/:patientId/prescriptions/:prescriptionId/edit`} element={<PrescriptionPage />} />
            <Route path={ROUTES.DOCTORS} element={<DoctorsPage />} />
            <Route path={ROUTES.MEDICAL_RECORDS} element={<MedicalRecordsPage />} />
            <Route path={ROUTES.BILLING} element={<BillingPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Catch-all 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
