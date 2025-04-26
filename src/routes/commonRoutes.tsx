import { Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoadingFallback } from "@/components/ui/loading-fallback";

// Import non-lazy loaded components
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Messages from "@/pages/Messages";
import ResourcesPage from "@/pages/ResourcesPage";
import Profile from "@/pages/Profile";
import TeachersPage from "@/pages/TeachersPage";
import NotFound from "@/pages/NotFound";

// Import lazy loaded components
const LiveClasses = lazy(() => import("@/pages/LiveClasses"));
const Courses = lazy(() => import("@/pages/Courses"));
const Course = lazy(() => import("@/pages/Course"));

export const commonRoutes = [
  <Route key="index" path="/" element={<Index />} />,
  <Route key="auth" path="/auth" element={<Auth />} />,
  <Route key="dashboard" path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />,
  <Route key="messages" path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />,
  <Route key="resources" path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />,
  <Route key="profile" path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />,
  <Route key="teachers" path="/teachers" element={<ProtectedRoute><TeachersPage /></ProtectedRoute>} />,
  <Route key="not-found" path="*" element={<NotFound />} />,
  <Route 
    key="live-classes"
    path="/live-classes" 
    element={
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <LiveClasses />
        </Suspense>
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="live-classes-id"
    path="/live-classes/:classId" 
    element={
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <LiveClasses />
        </Suspense>
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="courses"
    path="/courses" 
    element={
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <Courses />
        </Suspense>
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="course-detail"
    path="/courses/:slug" 
    element={
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <Course />
        </Suspense>
      </ProtectedRoute>
    } 
  />,
];
