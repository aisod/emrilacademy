
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface TeacherControlsProps {
  sessionInfo: any;
  participantCount: number;
  sessionDuration: number;
  jitsiApi: any;
}

export function TeacherControls({
  sessionInfo,
  participantCount,
  sessionDuration,
  jitsiApi,
}: TeacherControlsProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mutation to end session
  const endSession = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('class_sessions')
        .update({
          is_active: false,
          status: 'ended',
          ended_at: new Date().toISOString(),
          participant_count: participantCount,
          duration_seconds: sessionDuration
        })
        .eq('id', sessionInfo?.id);

      if (error) throw error;
      
      // Force all participants to leave
      if (jitsiApi) {
        jitsiApi.executeCommand('hangup');
      }
    },
    onSuccess: () => {
      toast({
        title: "Class ended",
        description: "The live session has been ended successfully.",
      });
      navigate('/teacher');
    },
    onError: (error) => {
      toast({
        title: "Error ending session",
        description: "Could not end the live session. Please try again.",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="absolute top-4 right-4 z-10 flex space-x-2">
      <div className="bg-black/70 text-white px-3 py-1 rounded text-sm">
        {participantCount} participant{participantCount !== 1 ? 's' : ''}
      </div>
      <div className="bg-black/70 text-white px-3 py-1 rounded text-sm">
        {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
      </div>
      <Button 
        variant="destructive"
        onClick={() => endSession.mutate()}
        className="bg-red-600 hover:bg-red-700"
      >
        End Class Session
      </Button>
    </div>
  );
}
