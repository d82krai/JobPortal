import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { CandidateDashboardPage } from './pages/CandidateDashboardPage';
import { EmployerDashboardPage } from './pages/EmployerDashboardPage';
import { JobsPage } from './pages/JobsPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { ChatPage } from './pages/ChatPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { LlmPage } from './pages/LlmPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { CandidateJobsPage } from './pages/CandidateJobsPage';
import { CandidateApplicationsPage } from './pages/CandidateApplicationsPage';
import { EmployerJobsPage } from './pages/EmployerJobsPage';
import { EmployerJobEditPage } from './pages/EmployerJobEditPage';
import { EmployerJobApplicationsPage } from './pages/EmployerJobApplicationsPage';
import { EmployerApplicationDetailPage } from './pages/EmployerApplicationDetailPage';
import { EmployerScreeningPage } from './pages/EmployerScreeningPage';
import { EmployerAssessmentReportPage } from './pages/EmployerAssessmentReportPage';
import { AssessmentTestEditPage } from './pages/AssessmentTestEditPage';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { NotificationsPage } from './pages/NotificationsPage';
import { CandidateEmployerRatingPage } from './pages/CandidateEmployerRatingPage';

const ProtectedApp: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/app" element={<ProtectedApp />}>
          <Route element={<MainLayout />}>
            <Route path="candidate" element={<CandidateDashboardPage />} />
            <Route path="candidate/profile" element={<CandidateProfilePage />} />
            <Route path="candidate/jobs" element={<CandidateJobsPage />} />
            <Route path="candidate/applications" element={<CandidateApplicationsPage />} />
             <Route
              path="candidate/employer-rating"
              element={<CandidateEmployerRatingPage />}
            />
            <Route path="employer/jobs" element={<EmployerJobsPage />} />
            <Route path="employer/jobs/new" element={<EmployerJobEditPage />} />
            <Route path="employer/jobs/:jobId" element={<EmployerJobEditPage />} />
            <Route
              path="employer/jobs/:jobId/applications"
              element={<EmployerJobApplicationsPage />}
            />
            <Route
              path="employer/applications/:applicationId"
              element={<EmployerApplicationDetailPage />}
            />
            <Route
              path="employer/applications/:applicationId/screening"
              element={<EmployerScreeningPage />}
            />
            <Route
              path="employer/assessments/:sessionId/report"
              element={<EmployerAssessmentReportPage />}
            />
            <Route path="employer" element={<EmployerDashboardPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="assessments" element={<AssessmentsPage />} />
            <Route path="assessments/tests/new" element={<AssessmentTestEditPage />} />
            <Route path="assessments/tests/:testId" element={<AssessmentTestEditPage />} />
            <Route path="llm" element={<LlmPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;


