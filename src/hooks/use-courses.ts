
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Course {
  id: string;
  title: string;
  description: string | null;
  status: string;
  slug: string;
  duration_weeks: number;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useCourses() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Course[];
    },
  });

  const createCourse = useMutation({
    mutationFn: async (data: Partial<Course>) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("courses")
        .insert([{ ...data, teacher_id: session.session.user.id }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Course created",
        description: "Your course has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create course. Please try again.",
      });
    },
  });

  return {
    courses,
    isLoading,
    createCourse,
  };
}
