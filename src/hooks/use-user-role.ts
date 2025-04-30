
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserRole() {
  return useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      // First, check for admin role in user_roles table
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
        
      if (userRole?.role === "admin") {
        return "admin" as "student" | "teacher" | "admin" | null;
      }

      // If not admin, get role from profiles table
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      return data?.role as "student" | "teacher" | "admin" | null;
    },
  });
}
