
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { SessionControlBar } from "./SessionControlBar";
import { SessionAnalyticsPanel } from "./SessionAnalyticsPanel";

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
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [peakParticipants, setPeakParticipants] = useState(participantCount);

  // Update peak participants count
  useEffect(() => {
    if (participantCount > peakParticipants) {
      setPeakParticipants(participantCount);
    }
  }, [participantCount, peakParticipants]);

  // Mutation to end session
  const endSession = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('class_sessions')
        .update({
          is_active: false,
          status: 'ended',
          ended_at: new Date().toISOString(),
          participant_count: peakParticipants,
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

  const handleEndSession = () => {
    endSession.mutate();
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
      <SessionControlBar 
        participantCount={participantCount}
        sessionDuration={sessionDuration}
        showAnalytics={showAnalytics}
        onToggleAnalytics={toggleAnalytics}
        onEndSession={handleEndSession}
      />
      
      {showAnalytics && sessionInfo?.id && (
        <SessionAnalyticsPanel 
          sessionId={sessionInfo.id}
          participantCount={participantCount}
          peakParticipants={peakParticipants}
          sessionDuration={sessionDuration}
        />
      )}
    </div>
  );
}
