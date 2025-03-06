
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useUserRole } from "@/hooks/use-user-role";

export function useSessionHistory() {
  const { toast } = useToast();
  const { data: userRole } = useUserRole();
  
  return useQuery({
    queryKey: ["session-history"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      let query = supabase
        .from("class_sessions")
        .select(`
          id,
          class_id,
          started_at,
          ended_at,
          participant_count,
          duration_seconds,
          class:classes(
            title,
            teacher:profiles!teacher_id(
              first_name,
              last_name
            )
          )
        `)
        .eq("is_active", false)
        .eq("status", "ended")
        .order("ended_at", { ascending: false });
      
      // If teacher, get sessions for classes they teach
      if (userRole === "teacher") {
        const { data: teacherClasses } = await supabase
          .from("classes")
          .select("id")
          .eq("teacher_id", session.user.id);
        
        if (teacherClasses && teacherClasses.length > 0) {
          query = query.in("class_id", teacherClasses.map(c => c.id));
        } else {
          return [];
        }
      } 
      // If student, get sessions they participated in
      else if (userRole === "student") {
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select("class_id")
          .eq("student_id", session.user.id);
        
        if (enrollments && enrollments.length > 0) {
          query = query.in("class_id", enrollments.map(e => e.class_id));
        } else {
          return [];
        }
      }

      const { data, error } = await query.limit(10);

      if (error) {
        toast({
          title: "Error fetching session history",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
    enabled: !!userRole,
  });
}
