
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useJitsiMeeting(classId: string, sessionInfo: any, isJoined: boolean) {
  const [jitsiApi, setJitsiApi] = useState<any>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const { toast } = useToast();

  // Set session start time when session info is available
  useEffect(() => {
    if (sessionInfo) {
      setSessionStartTime(sessionInfo.started_at ? new Date(sessionInfo.started_at) : new Date());
    }
  }, [sessionInfo]);

  // Update participant count and session duration
  useEffect(() => {
    if (jitsiApi && sessionStartTime) {
      const intervalId = setInterval(() => {
        if (jitsiApi) {
          const count = jitsiApi.getNumberOfParticipants();
          setParticipantCount(count);
          
          // Calculate duration
          const now = new Date();
          const durationMs = now.getTime() - sessionStartTime.getTime();
          setSessionDuration(Math.floor(durationMs / 1000));
        }
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [jitsiApi, sessionStartTime]);

  // Mutation to add participant to session
  const addParticipant = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !sessionInfo) return null;

      const { data, error } = await supabase
        .from("session_participants")
        .upsert({
          session_id: sessionInfo.id,
          user_id: session.user.id,
          join_time: new Date().toISOString(),
        })
        .select();

      if (error) {
        throw error;
      }
      
      return data?.[0]?.id || null;
    },
    onSuccess: (id) => {
      console.log("Participant added to session");
      setParticipantId(id);
    },
    onError: (error) => {
      toast({
        title: "Error tracking attendance",
        description: "We couldn't record your attendance in this session.",
        variant: "destructive",
      });
    }
  });

  // Mutation to update leave time when leaving
  const updateLeaveTime = useMutation({
    mutationFn: async () => {
      if (!participantId) return;

      return supabase
        .from("session_participants")
        .update({
          leave_time: new Date().toISOString(),
        })
        .eq("id", participantId);
    },
    onSuccess: () => {
      console.log("Participant leave time updated");
    },
  });

  // Add participant when joining
  useEffect(() => {
    if (isJoined && sessionInfo?.id) {
      addParticipant.mutate();
    }
  }, [isJoined, sessionInfo?.id]);

  // Update leave time when component unmounts or when user leaves
  useEffect(() => {
    return () => {
      if (participantId) {
        updateLeaveTime.mutate();
      }
    };
  }, [participantId]);

  // Also update leave time when user manually leaves
  useEffect(() => {
    if (jitsiApi) {
      const handleUserLeft = () => {
        if (participantId) {
          updateLeaveTime.mutate();
        }
      };

      jitsiApi.addEventListener('videoConferenceLeft', handleUserLeft);

      return () => {
        jitsiApi.removeEventListener('videoConferenceLeft', handleUserLeft);
      };
    }
  }, [jitsiApi, participantId]);

  return {
    jitsiApi,
    setJitsiApi,
    participantCount,
    sessionDuration,
    sessionStartTime
  };
}
