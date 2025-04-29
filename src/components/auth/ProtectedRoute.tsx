
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { LoadingFallback } from '@/components/ui/loading-fallback';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();

  // Check for admin token in localStorage (our special case)
  const adminSessionData = localStorage.getItem('supabase.auth.token');
  const isAdmin = adminSessionData && adminSessionData.includes('admin@emrilacademy.tech');

  // If we have an admin user from localStorage, handle that case
  if (isAdmin) {
    // If this is an admin route or no specific role is required, allow access
    if (!requiredRole || requiredRole === 'admin') {
      return <>{children}</>;
    } else {
      // Admins shouldn't access student or teacher specific routes
      return <Navigate to="/admin" replace />;
    }
  }

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: userRole, isLoading: isRoleLoading } = useQuery({
    queryKey: ['user-role', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      // Special case for hardcoded admin
      if (session.user.email === "admin@emrilacademy.tech") {
        return "admin";
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data?.role;
    },
    enabled: !!session?.user?.id,
  });

  if (isSessionLoading || (session && isRoleLoading)) {
    return <LoadingFallback />;
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
