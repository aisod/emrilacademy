
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserRole() {
  return useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      try {
        // Check for admin token in localStorage
        const adminSessionData = localStorage.getItem('supabase.auth.token');
        if (adminSessionData) {
          // Parse the admin session from localStorage
          try {
            const adminSession = JSON.parse(adminSessionData);
            const userEmail = adminSession?.currentSession?.user?.email;
            
            // Check if this is the admin email (case insensitive)
            if (userEmail && userEmail.toLowerCase() === 'admin@emrilacademy.tech') {
              console.log("Admin user identified from localStorage");
              return "admin" as const;
            }
          } catch (e) {
            console.error("Error parsing admin session:", e);
          }
        }

        // Check for regular Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No session found");
          return null;
        }

        // Special case for hardcoded admin
        if (session.user.email && session.user.email.toLowerCase() === "admin@emrilacademy.tech") {
          console.log("Admin identified from session email");
          return "admin" as const;
        }

        // Get role from profiles table
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        console.log("User role from database:", data?.role);
        return data?.role as "student" | "teacher" | "admin" | null;
      } catch (error) {
        console.error("Error in useUserRole:", error);
        return null;
      }
    },
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: false, // Don't retry on error
  });
}
