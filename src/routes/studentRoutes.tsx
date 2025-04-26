
import { Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoadingFallback } from "@/components/ui/loading-fallback";

const StudentDashboard = lazy(() => import("@/pages/StudentDashboard"));
const BrowseClasses = lazy(() => import("@/pages/BrowseClasses"));
const Course = lazy(() => import("@/pages/Course"));

export const studentRoutes = [
  <Route 
    key="student-dashboard"
    path="/student" 
    element={
      <ProtectedRoute requiredRole="student">
        <Suspense fallback={<LoadingFallback />}>
          <StudentDashboard />
        </Suspense>
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="browse-classes"
    path="/browse-classes" 
    element={
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <BrowseClasses />
        </Suspense>
      </ProtectedRoute>
    } 
  />,
];
