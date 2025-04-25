
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

export interface CreateCourseDto {
  title: string;
  description?: string | null;
  status?: string;
  slug: string;
  duration_weeks?: number;
  thumbnail_url?: string | null;
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
    mutationFn: async (data: CreateCourseDto) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      // First check if slug is already used
      const { data: existingCourse, error: checkError } = await supabase
        .from("courses")
        .select("id")
        .eq("slug", data.slug)
        .limit(1);
        
      if (checkError) throw checkError;
      
      if (existingCourse && existingCourse.length > 0) {
        throw new Error(`A course with the slug "${data.slug}" already exists`);
      }

      const { error } = await supabase
        .from("courses")
        .insert({
          ...data,
          teacher_id: session.session.user.id,
        });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Course created",
        description: "Your course has been created successfully.",
      });
    },
    onError: (error: Error) => {
      console.error("Error in createCourse:", error);
      
      // Check if error is a duplicate slug error
      const errorMessage = error.message.includes("already exists")
        ? error.message
        : "Failed to create course. Please check your inputs and try again.";
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    },
  });

  return {
    courses,
    isLoading,
    createCourse,
  };
}
