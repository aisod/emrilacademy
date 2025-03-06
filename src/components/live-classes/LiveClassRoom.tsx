
import { useEffect, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { LiveChat } from "./LiveChat";
import { useUserRole } from "@/hooks/use-user-role";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LiveClassRoomProps {
  classId: string;
  className?: string;
  teacherName?: string;
  isJoined: boolean;
  onJoinStatusChange: (joined: boolean) => void;
}

export function LiveClassRoom({
  classId,
  className = "Class",
  teacherName = "Teacher",
  isJoined,
  onJoinStatusChange,
}: LiveClassRoomProps) {
  const { data: userRole } = useUserRole();
  const [jitsiApi, setJitsiApi] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [participantCount, setParticipantCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Query to get session info
  const { data: sessionInfo, refetch: refetchSession } = useQuery({
    queryKey: ["class-session", classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_sessions")
        .select("*")
        .eq("class_id", classId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSessionStartTime(data.started_at ? new Date(data.started_at) : new Date());
      }
      return data;
    },
  });

  // Query to get user info
  const { data: userInfo } = useQuery({
    queryKey: ["user-info"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", session.user.id)
        .single();

      return data;
    },
  });

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

  // Add participant when joining
  useEffect(() => {
    if (isJoined && sessionInfo?.id) {
      addParticipant.mutate();
    }
  }, [isJoined, sessionInfo?.id]);

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

  const handleJitsiIFrameRef = (iframeRef: any) => {
    iframeRef.style.border = "10px solid #000";
    iframeRef.style.background = "#000";
    iframeRef.style.height = "100%";
    iframeRef.style.width = "100%";
  };

  // Check if session is active
  if (!sessionInfo && userRole === "teacher") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Start Live Class Session</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">No active session found for this class. Would you like to start one?</p>
            <Button 
              onClick={async () => {
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
                  refetchSession();
                  
                  toast({
                    title: "Live session started",
                    description: "Students can now join your class.",
                  });
                } catch (error: any) {
                  toast({
                    title: "Error starting session",
                    description: error.message || "Could not start the live session",
                    variant: "destructive",
                  });
                }
              }}
              className="w-full"
            >
              Start Live Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sessionInfo && userRole === "student") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Alert className="max-w-md">
          <AlertTitle>No Active Session</AlertTitle>
          <AlertDescription>
            There is no active session for this class. Please check back later when the teacher starts the session.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => navigate('/browse-classes')}
          className="mt-4"
          variant="outline"
        >
          Browse Classes
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-900">
      <div className="flex-1 relative">
        <JitsiMeeting
          roomName={`emmadex-class-${classId}`}
          configOverwrite={{
            startWithAudioMuted: true,
            startWithVideoMuted: false,
            enableClosePage: false,
            toolbarButtons: userRole === "teacher" 
              ? ['camera', 'microphone', 'screenshare', 'participants', 'chat', 'recording']
              : ['camera', 'microphone', 'participants', 'chat'],
          }}
          interfaceConfigOverwrite={{
            TOOLBAR_BUTTONS: userRole === "teacher" 
              ? ['camera', 'microphone', 'screenshare', 'participants', 'chat', 'recording']
              : ['camera', 'microphone', 'participants', 'chat'],
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          }}
          userInfo={{
            displayName: userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : "",
            email: "user@example.com"
          }}
          onApiReady={(api) => {
            setJitsiApi(api);
            onJoinStatusChange(true);
          }}
          getIFrameRef={handleJitsiIFrameRef}
        />
        {userRole === "teacher" && (
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
        )}
      </div>
      <div className="w-80 bg-white border-l">
        <LiveChat classId={classId} />
      </div>
    </div>
  );
}
