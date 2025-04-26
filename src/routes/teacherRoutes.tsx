
import { Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoadingFallback } from "@/components/ui/loading-fallback";

const TeacherDashboard = lazy(() => import("@/pages/TeacherDashboard"));

export const teacherRoutes = (
  <Route 
    path="/teacher" 
    element={
      <ProtectedRoute requiredRole="teacher">
        <Suspense fallback={<LoadingFallback />}>
          <TeacherDashboard />
        </Suspense>
      </ProtectedRoute>
    } 
  />
);
