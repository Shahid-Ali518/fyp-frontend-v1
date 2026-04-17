import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Layout from "@/components/Layout";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Services from "./pages/Services.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/auth/Login.tsx";
import Signup from "./pages/auth/Signup.tsx";
import ProtectedRoute from "./pages/auth/ProtectedRoute.tsx";
import UserDashboard from "./pages/user/UserDashboard.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import ManageUsers from "./pages/admin/ManageUsers.tsx";
import ManageAssessments from "./pages/admin/ManageAssessments.tsx";
import NewAssessment from "./pages/admin/NewAssessment.tsx";
import AddQuestions from "./pages/admin/AddQuestions.tsx";
import AddSurveyOptions from "./pages/admin/AddSurveyOptions.tsx";
import AddClassRanges from "./pages/admin/AddClassRanges.tsx";
import ManageAssessmentDetail from "./pages/admin/ManageAssessmentDetail.tsx";
import Assessments from "./pages/assessment/Assessments.tsx";
import AssessmentPlayer from "./pages/assessment/OptionAssessmentPalyer.tsx";
import AssessmentResult from "./pages/assessment/AssessmentResult.tsx";
import AudioAssessmentPlayer from "./pages/assessment/AudioAssessmentPlayer.tsx";
import OptionAssessmentPlayer from "./pages/assessment/OptionAssessmentPalyer.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Layout wraps all pages */}
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/assessments" element={<Assessments />} />

            {/* User-Only Routes ===================================================== */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment/start/:assessmentId"
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <OptionAssessmentPlayer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment/start/voice/:assessmentId/:attemptId"
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <AudioAssessmentPlayer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessments"
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <Assessments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment/results/:attemptId"
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <AssessmentResult />
                </ProtectedRoute>
              }
            />

            {/* Admin-Only Routes =========================================== */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/assessments"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <ManageAssessments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/assessments/new"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <NewAssessment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/assessments/:assessmentId/questions"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AddQuestions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/assessments/:assessmentId/survey-options"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AddSurveyOptions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/assessments/:assessmentId/class-ranges"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AddClassRanges />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/assessments/:assessmentId/manage"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <ManageAssessmentDetail />
                </ProtectedRoute>
              }
            />

          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;