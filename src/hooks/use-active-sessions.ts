
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useActiveSessions() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["active-class-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_sessions")
        .select(`
          id,
          class_id,
          is_active,
          started_at,
          status,
          class:classes(
            title,
            teacher:profiles!teacher_id(
              first_name,
              last_name
            )
          )
        `)
        .eq("is_active", true)
        .eq("status", "active");

      if (error) {
        toast({
          title: "Error fetching active classes",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
  });
}
