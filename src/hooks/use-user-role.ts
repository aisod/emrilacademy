
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserRole() {
  return useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      // Check for admin token in localStorage (our special case)
      const adminSessionData = localStorage.getItem('supabase.auth.token');
      if (adminSessionData && adminSessionData.includes('admin@emrilacademy.tech')) {
        return "admin" as const;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      // Special case for hardcoded admin
      if (session.user.email === "admin@emrilacademy.tech") {
        return "admin" as const;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      return data?.role as "student" | "teacher" | "admin" | null;
    },
  });
}
