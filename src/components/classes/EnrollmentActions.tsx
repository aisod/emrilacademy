
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader, Play, Video, CheckCircle } from "lucide-react";
import type { Class } from "./types";

interface EnrollmentActionsProps {
  class_: Class;
  isSessionActive?: boolean;
}

export function EnrollmentActions({ class_, isSessionActive = false }: EnrollmentActionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

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

      // Check if already enrolled to prevent duplicate enrollments
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

      // Show success state briefly
      setEnrollmentSuccess(true);
      setTimeout(() => setEnrollmentSuccess(false), 2000);

      toast({
        title: "Success",
        description: "Successfully enrolled in class",
      });

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["available-classes"] });
      queryClient.invalidateQueries({ queryKey: ["student-stats"] });
      queryClient.invalidateQueries({ queryKey: ["next-class"] });
      queryClient.invalidateQueries({ queryKey: ["student-classes"] });
      
      // Add the current class view to ensure it updates immediately
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

  const handleJoinLiveClass = (classId: string) => {
    // Track analytics for class joining if needed
    console.log("Joining class:", classId);
    navigate(`/live-classes/${classId}`);
  };

  const startLiveSession = async (classId: string) => {
    setIsStarting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        toast({
          title: "Authentication required",
          description: "Please sign in to start a live session",
        });
        return;
      }

      // Check if user is the teacher
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('teacher_id')
        .eq('id', classId)
        .single();
        
      if (classError) throw classError;
      
      if (classData.teacher_id !== session.user.id) {
        throw new Error("Only the teacher can start this session");
      }

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
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
      
      navigate(`/live-classes/${classId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error starting session",
        description: error.message || "Could not start live session",
      });
    } finally {
      setIsStarting(false);
    }
  };

  const isClassFull = (class_.enrollments[0]?.count || 0) >= class_.capacity;
  const isEnrolled = class_.isEnrolled;

  return (
    <div className="space-y-2">
      {isEnrolled ? (
        <>
          {class_.class_type === "live" && isSessionActive && (
            <Button 
              onClick={() => handleJoinLiveClass(class_.id)}
              className="w-full group"
              variant="default"
            >
              <Video className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Join Live Class
            </Button>
          )}
          <Button variant="secondary" className="w-full flex items-center justify-center gap-2" disabled>
            <CheckCircle className="h-4 w-4" />
            Already Enrolled
          </Button>
        </>
      ) : (
        <>
          {class_.class_type === "live" && !isEnrolled && isSessionActive && (
            <Button 
              onClick={() => handleJoinLiveClass(class_.id)}
              className="w-full mb-2 group"
              variant="default"
            >
              <Video className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Join as Guest
            </Button>
          )}
          <Button
            onClick={() => handleEnroll(class_.id)}
            className="w-full"
            variant={enrollmentSuccess ? "outline" : "default"}
            disabled={isClassFull || isEnrolling || enrollmentSuccess}
          >
            {isEnrolling ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" /> 
                Enrolling...
              </>
            ) : enrollmentSuccess ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Enrolled Successfully
              </>
            ) : isClassFull ? (
              "Class Full"
            ) : (
              "Enroll Now"
            )}
          </Button>
        </>
      )}
    </div>
  );
}
