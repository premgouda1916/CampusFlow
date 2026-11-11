import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Public pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import StudentRegisterPage from '../pages/auth/StudentRegisterPage';
import RecruiterRegisterPage from '../pages/auth/RecruiterRegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Student pages
import StudentDashboard from '../pages/student/StudentDashboard';
import JobsExplorerPage from '../pages/student/JobsExplorerPage';
import JobDetailsPage from '../pages/student/JobDetailsPage';
import MyApplicationsPage from '../pages/student/MyApplicationsPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';
import StudentInterviewsPage from '../pages/student/StudentInterviewsPage';
import StudentOffersPage from '../pages/student/StudentOffersPage';

// Recruiter pages
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import RecruiterJobsPage from '../pages/recruiter/RecruiterJobsPage';
import CreateJobPage from '../pages/recruiter/CreateJobPage';
import RecruiterApplicantsPage from '../pages/recruiter/RecruiterApplicantsPage';
import RecruiterInterviewsPage from '../pages/recruiter/RecruiterInterviewsPage';
import RecruiterOffersPage from '../pages/recruiter/RecruiterOffersPage';

// Placement officer pages
import PlacementDashboard from '../pages/officer/PlacementDashboard';
import RecruiterApprovalsPage from '../pages/officer/RecruiterApprovalsPage';
import StudentDirectoryPage from '../pages/officer/StudentDirectoryPage';
import PlacementDrivesPage from '../pages/officer/PlacementDrivesPage';
import PlacementReportsPage from '../pages/officer/PlacementReportsPage';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';

export const AppRoutes = () => {
  return (
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
  );
};

export default AppRoutes;
