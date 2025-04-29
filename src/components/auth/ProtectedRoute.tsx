
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { LoadingFallback } from '@/components/ui/loading-fallback';
import { useUserRole } from '@/hooks/use-user-role';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  
  // Use our centralized useUserRole hook for consistency
  const { data: userRole, isLoading: isRoleLoading, error } = useUserRole();

  // Check session in parallel
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  // Show loading state while checking auth
  if (isSessionLoading || isRoleLoading) {
    return <LoadingFallback />;
  }

  // For debugging
  console.log("Protected route check:", { 
    userRole, 
    requiredRole, 
    hasSession: !!session,
    path: location.pathname
  });

  // If no session and not admin, redirect to auth
  if (!session && userRole !== 'admin') {
    console.log("No session, redirecting to auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If the route requires a specific role
  if (requiredRole && userRole !== requiredRole) {
    console.log(`Role ${requiredRole} required, but user has role ${userRole}`);
    
    // If user is admin, send to admin dashboard
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    
    // For other roles, send to main dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
