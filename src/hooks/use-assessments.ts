
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type AssessmentType = "weekly" | "monthly" | "final";

export interface Assessment {
  id: string;
  title: string;
  description: string | null;
  type: AssessmentType;
  due_date: string;
  course_id: string;
  total_points: number;
  created_at: string;
}

export interface CreateAssessmentDto {
  title: string;
  description?: string | null;
  type: AssessmentType;
  due_date: string;
  total_points?: number;
}

export function useAssessments(courseId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: assessments = [], isLoading } = useQuery({
    queryKey: ["assessments", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("course_id", courseId)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as Assessment[];
    },
  });

  const createAssessment = useMutation({
    mutationFn: async (data: CreateAssessmentDto) => {
      const { error } = await supabase
        .from("assessments")
        .insert({
          ...data,
          course_id: courseId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments", courseId] });
      toast({
        title: "Assessment created",
        description: "Assessment has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create assessment. Please try again.",
      });
    },
  });

  return {
    assessments,
    isLoading,
    createAssessment,
  };
}
