
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useActiveSessions() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["active-class-sessions"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("class_sessions")
          .select(`
            id,
            class_id,
            is_active,
            started_at,
            status,
            class:classes(
              id,
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
          throw error;
        }

        return data || [];
      } catch (error: any) {
        toast({
          title: "Error fetching active classes",
          description: error?.message || "Something went wrong",
          variant: "destructive",
        });
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds to keep session list updated
    retry: 2,
  });
}
