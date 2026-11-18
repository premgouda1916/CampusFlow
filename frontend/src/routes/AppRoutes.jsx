import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Public pages (lazy-loaded for fast initial bundle delivery)
const LandingPage = lazy(() => import('../pages/public/LandingPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const StudentRegisterPage = lazy(() => import('../pages/auth/StudentRegisterPage'));
const RecruiterRegisterPage = lazy(() => import('../pages/auth/RecruiterRegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));

// Student pages (lazy-loaded)
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const JobsExplorerPage = lazy(() => import('../pages/student/JobsExplorerPage'));
const JobDetailsPage = lazy(() => import('../pages/student/JobDetailsPage'));
const MyApplicationsPage = lazy(() => import('../pages/student/MyApplicationsPage'));
const StudentProfilePage = lazy(() => import('../pages/student/StudentProfilePage'));
const StudentInterviewsPage = lazy(() => import('../pages/student/StudentInterviewsPage'));
const StudentOffersPage = lazy(() => import('../pages/student/StudentOffersPage'));

// Recruiter pages (lazy-loaded)
const RecruiterDashboard = lazy(() => import('../pages/recruiter/RecruiterDashboard'));
const RecruiterJobsPage = lazy(() => import('../pages/recruiter/RecruiterJobsPage'));
const CreateJobPage = lazy(() => import('../pages/recruiter/CreateJobPage'));
const RecruiterApplicantsPage = lazy(() => import('../pages/recruiter/RecruiterApplicantsPage'));
const RecruiterInterviewsPage = lazy(() => import('../pages/recruiter/RecruiterInterviewsPage'));
const RecruiterOffersPage = lazy(() => import('../pages/recruiter/RecruiterOffersPage'));

// Placement officer pages (lazy-loaded)
const PlacementDashboard = lazy(() => import('../pages/officer/PlacementDashboard'));
const RecruiterApprovalsPage = lazy(() => import('../pages/officer/RecruiterApprovalsPage'));
const StudentDirectoryPage = lazy(() => import('../pages/officer/StudentDirectoryPage'));
const PlacementDrivesPage = lazy(() => import('../pages/officer/PlacementDrivesPage'));
const PlacementReportsPage = lazy(() => import('../pages/officer/PlacementReportsPage'));

// Admin pages (lazy-loaded)
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));

// Fluid, non-intrusive loading placeholder matching spatial dark palette
const RouteFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#18181b]/80 border border-white/10 text-zinc-300 text-xs backdrop-blur-md shadow-spatial-card">
      <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      <span>Loading view...</span>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/student" element={<StudentRegisterPage />} />
        <Route path="/register/recruiter" element={<RecruiterRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Student Portal (ROLE: STUDENT) */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/jobs" element={<JobsExplorerPage />} />
            <Route path="/student/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/student/applications" element={<MyApplicationsPage />} />
            <Route path="/student/interviews" element={<StudentInterviewsPage />} />
            <Route path="/student/offers" element={<StudentOffersPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
          </Route>
        </Route>

        {/* Recruiter Portal (ROLE: RECRUITER) */}
        <Route element={<ProtectedRoute allowedRoles={['RECRUITER']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
            <Route path="/recruiter/jobs/new" element={<CreateJobPage />} />
            <Route path="/recruiter/jobs/edit/:id" element={<CreateJobPage />} />
            <Route path="/recruiter/applicants" element={<RecruiterApplicantsPage />} />
            <Route path="/recruiter/interviews" element={<RecruiterInterviewsPage />} />
            <Route path="/recruiter/offers" element={<RecruiterOffersPage />} />
          </Route>
        </Route>

        {/* Placement Officer Portal (ROLE: PLACEMENT_OFFICER, ADMIN) */}
        <Route element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/officer/dashboard" element={<PlacementDashboard />} />
            <Route path="/officer/approvals" element={<RecruiterApprovalsPage />} />
            <Route path="/officer/students" element={<StudentDirectoryPage />} />
            <Route path="/officer/drives" element={<PlacementDrivesPage />} />
            <Route path="/officer/reports" element={<PlacementReportsPage />} />
          </Route>
        </Route>

        {/* Admin Portal (ROLE: ADMIN) */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
