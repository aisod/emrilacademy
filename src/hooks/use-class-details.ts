
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useClassDetails(classId: string | undefined) {
  return useQuery({
    queryKey: ["class-details", classId],
    queryFn: async () => {
      if (!classId) return null;
      const { data } = await supabase
        .from("classes")
        .select(`
          *,
          teacher:profiles!teacher_id(
            first_name,
            last_name
          )
        `)
        .eq("id", classId)
        .single();
      return data;
    },
    enabled: !!classId,
  });
}
