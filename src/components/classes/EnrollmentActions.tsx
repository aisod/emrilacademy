
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { Class } from "./types";

interface EnrollmentActionsProps {
  class_: Class;
}

export function EnrollmentActions({ class_ }: EnrollmentActionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleEnroll = async (classId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please sign in to enroll");

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

      toast({
        title: "Success",
        description: "Successfully enrolled in class",
      });

      queryClient.invalidateQueries({ queryKey: ["available-classes"] });
      queryClient.invalidateQueries({ queryKey: ["student-stats"] });
      queryClient.invalidateQueries({ queryKey: ["next-class"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const isClassInProgress = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return false;
    const now = new Date();
    const classStart = new Date(startTime);
    const classEnd = new Date(endTime);
    return now >= classStart && now <= classEnd;
  };

  const handleJoinLiveClass = (classId: string) => {
    navigate(`/live-classes/${classId}`);
  };

  return (
    <div className="space-y-2">
      {class_.isEnrolled ? (
        <>
          {class_.class_type === "live" && 
           isClassInProgress(class_.start_time, class_.end_time) && (
            <Button 
              onClick={() => handleJoinLiveClass(class_.id)}
              className="w-full"
              variant="default"
            >
              Join Live Class
            </Button>
          )}
          <Button variant="secondary" className="w-full" disabled>
            Already Enrolled
          </Button>
        </>
      ) : (
        <Button
          onClick={() => handleEnroll(class_.id)}
          className="w-full"
          disabled={(class_.enrollments[0]?.count || 0) >= class_.capacity}
        >
          {(class_.enrollments[0]?.count || 0) >= class_.capacity
            ? "Class Full"
            : "Enroll Now"
          }
        </Button>
      )}
    </div>
  );
}
