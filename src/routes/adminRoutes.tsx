
import { Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoadingFallback } from "@/components/ui/loading-fallback";

const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

export const adminRoutes = (
  <Route 
    path="/admin" 
    element={
      <ProtectedRoute requiredRole="admin">
        <Suspense fallback={<LoadingFallback />}>
          <AdminDashboard />
        </Suspense>
      </ProtectedRoute>
    } 
  />
);
