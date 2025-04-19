
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Class } from "@/components/classes/types";

export function useClassEnrollment(class_: Class) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleEnroll = async (classId: string) => {
    setIsEnrolling(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        toast({
          title: "Authentication required",
          description: "Please sign in to enroll in a class",
        });
        return;
      }

      const { data: existingEnrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("class_id", classId)
        .eq("student_id", session.user.id)
        .maybeSingle();
        
      if (existingEnrollment) {
        toast({
          title: "Already enrolled",
          description: "You are already enrolled in this class",
        });
        return;
      }

      const { error } = await supabase
        .from("enrollments")
        .insert({
          class_id: classId,
          student_id: session.user.id,
        });

      if (error) {
        if (error.message.includes("maximum capacity")) {
          throw new Error("This class has reached its maximum capacity");
        }
        throw error;
      }

      setEnrollmentSuccess(true);
      setTimeout(() => setEnrollmentSuccess(false), 2000);

      toast({
        title: "Success",
        description: "Successfully enrolled in class",
      });

      queryClient.invalidateQueries({ queryKey: ["available-classes"] });
      queryClient.invalidateQueries({ queryKey: ["student-stats"] });
      queryClient.invalidateQueries({ queryKey: ["next-class"] });
      queryClient.invalidateQueries({ queryKey: ["student-classes"] });
      queryClient.invalidateQueries({ queryKey: ["class", classId] });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Enrollment failed",
        description: error.message || "Unable to enroll in this class",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return {
    isEnrolling,
    enrollmentSuccess,
    handleEnroll
  };
}
