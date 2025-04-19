
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useLiveSession() {
  const [isStarting, setIsStarting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('teacher_id')
        .eq('id', classId)
        .single();
        
      if (classError) throw classError;
      
      if (classData.teacher_id !== session.user.id) {
        throw new Error("Only the teacher can start this session");
      }

      const { error } = await supabase
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

  const handleJoinLiveClass = (classId: string) => {
    navigate(`/live-classes/${classId}`);
  };

  return {
    isStarting,
    startLiveSession,
    handleJoinLiveClass
  };
}
