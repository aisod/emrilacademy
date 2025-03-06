
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useSessionHistory() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["session-history"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return [];
      }

      // Fetch class sessions
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", session.user.id)
        .single();

      // Different queries for teachers and students
      if (userProfile?.role === "teacher") {
        // For teachers, show all sessions for classes they teach
        const { data, error } = await supabase
          .from("class_sessions")
          .select(`
            id, 
            started_at, 
            ended_at, 
            duration_seconds, 
            participant_count,
            status,
            classes:class_id (
              id, 
              title,
              teacher_id
            )
          `)
          .eq("classes.teacher_id", session.user.id)
          .order("started_at", { ascending: false });

        if (error) {
          toast({
            title: "Error fetching session history",
            description: error.message,
            variant: "destructive",
          });
          return [];
        }

        return data || [];
      } else {
        // For students, show sessions they've participated in
        const { data, error } = await supabase
          .from("session_participants")
          .select(`
            session_id,
            join_time,
            leave_time,
            class_sessions:session_id (
              id,
              started_at,
              ended_at,
              duration_seconds,
              participant_count,
              status,
              classes:class_id (
                id,
                title
              )
            )
          `)
          .eq("user_id", session.user.id)
          .order("join_time", { ascending: false });

        if (error) {
          toast({
            title: "Error fetching session history",
            description: error.message,
            variant: "destructive",
          });
          return [];
        }

        // Transform the data to match the teacher format
        return (data || []).map(item => ({
          id: item.class_sessions?.id,
          started_at: item.class_sessions?.started_at,
          ended_at: item.class_sessions?.ended_at,
          duration_seconds: item.class_sessions?.duration_seconds,
          participant_count: item.class_sessions?.participant_count,
          status: item.class_sessions?.status,
          classes: item.class_sessions?.classes,
          // Add student-specific fields
          join_time: item.join_time,
          leave_time: item.leave_time
        })).filter(item => item.id); // Filter out any sessions with no ID
      }
    },
  });
}
