
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/use-user-role";
import { LoadingFallback } from "@/components/ui/loading-fallback";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: role, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading) {
      if (role === 'teacher') {
        navigate('/teacher', { replace: true });
      } else if (role === 'student') {
        navigate('/student', { replace: true });
      } else {
        // If no role, redirect to auth
        navigate('/auth', { replace: true });
      }
    }
  }, [role, isLoading, navigate]);

  return <LoadingFallback />;
}
