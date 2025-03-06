
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useJitsiMeeting(classId: string, sessionInfo: any, isJoined: boolean) {
  const [jitsiApi, setJitsiApi] = useState<any>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

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
      if (!session || !sessionInfo) return;

      return supabase
        .from("session_participants")
        .upsert({
          session_id: sessionInfo.id,
          user_id: session.user.id,
          join_time: new Date().toISOString(),
        })
        .select();
    },
    onSuccess: () => {
      console.log("Participant added to session");
    },
  });

  // Add participant when joining
  useEffect(() => {
    if (isJoined && sessionInfo?.id) {
      addParticipant.mutate();
    }
  }, [isJoined, sessionInfo?.id]);

  return {
    jitsiApi,
    setJitsiApi,
    participantCount,
    sessionDuration,
    sessionStartTime
  };
}
