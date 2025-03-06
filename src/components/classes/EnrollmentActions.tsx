
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Play, Video } from "lucide-react";
import type { Class } from "./types";

interface EnrollmentActionsProps {
  class_: Class;
  isSessionActive?: boolean;
}

export function EnrollmentActions({ class_, isSessionActive = false }: EnrollmentActionsProps) {
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

  const handleJoinLiveClass = (classId: string) => {
    navigate(`/live-classes/${classId}`);
  };

  const startLiveSession = async (classId: string) => {
    try {
      const { data, error } = await supabase
        .from('class_sessions')
        .upsert({
          class_id: classId,
          is_active: true,
          status: 'active',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Live session started",
        description: "Students can now join your class.",
      });
      
      navigate(`/live-classes/${classId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not start live session",
      });
    }
  };

  return (
    <div className="space-y-2">
      {class_.isEnrolled ? (
        <>
          {class_.class_type === "live" && isSessionActive && (
            <Button 
              onClick={() => handleJoinLiveClass(class_.id)}
              className="w-full"
              variant="default"
            >
              <Video className="mr-2 h-4 w-4" />
              Join Live Class
            </Button>
          )}
          <Button variant="secondary" className="w-full" disabled>
            Already Enrolled
          </Button>
        </>
      ) : (
        <>
          {class_.class_type === "live" && !class_.isEnrolled && isSessionActive && (
            <Button 
              onClick={() => handleJoinLiveClass(class_.id)}
              className="w-full mb-2"
              variant="default"
            >
              <Video className="mr-2 h-4 w-4" />
              Join as Guest
            </Button>
          )}
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
        </>
      )}
    </div>
  );
}
