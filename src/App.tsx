import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { JobsPage } from "@/pages/JobsPage";
import { MyApplicationsPage } from "@/pages/MyApplicationsPage";
import { CompanyJobsPage } from "@/pages/CompanyJobsPage";
import { JobCandidatesPage } from "@/pages/JobCandidatesPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute allowedRoles={["JOB_SEEKER"]}>
                <MyApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/jobs"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <CompanyJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/jobs/:id/candidates"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <JobCandidatesPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
