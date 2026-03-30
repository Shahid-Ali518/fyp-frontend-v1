import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Layout from "@/components/Layout";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Services from "./pages/Services.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./features/auth/Login.tsx";
import Signup from "./features/auth/Signup.tsx";
import ProtectedRoute from "./features/auth/ProtectedRoute.tsx";
import UserDashboard from "./features/user/UserDashboard.tsx";
import AdminDashboard from "./features/admin/AdminDashboard.tsx";
import ManageUsers from "./features/admin/ManageUsers.tsx";
import ManageAssessments from "./features/admin/ManageAssessments.tsx";
import NewAssessment from "./features/admin/NewAssessment.tsx";
import AddQuestions from "./features/admin/AddQuestions.tsx";
import AddSurveyOptions from "./features/admin/AddSurveyOptions.tsx";
import AddClassRanges from "./features/admin/AddClassRanges.tsx";
import ManageAssessmentDetail from "./features/admin/ManageAssessmentDetail.tsx";

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

            {/* User-Only Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <UserDashboard />
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