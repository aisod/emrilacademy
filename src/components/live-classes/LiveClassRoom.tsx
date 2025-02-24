
import { useEffect, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { LiveChat } from "./LiveChat";
import { useUserRole } from "@/hooks/use-user-role";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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

  const endSession = async () => {
    try {
      const { error } = await supabase
        .from('class_sessions')
        .update({
          is_active: false,
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('class_id', classId);

      if (error) throw error;

      toast({
        title: "Class ended",
        description: "The live session has been ended successfully.",
      });

      // Force all participants to leave
      if (jitsiApi) {
        jitsiApi.executeCommand('hangup');
      }

      navigate('/teacher');
    } catch (error) {
      toast({
        title: "Error ending session",
        description: "Could not end the live session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleJitsiIFrameRef = (iframeRef: any) => {
    iframeRef.style.border = "10px solid #000";
    iframeRef.style.background = "#000";
    iframeRef.style.height = "100%";
    iframeRef.style.width = "100%";
  };

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
          onApiReady={(api) => setJitsiApi(api)}
          getIFrameRef={handleJitsiIFrameRef}
        />
        {userRole === "teacher" && (
          <div className="absolute top-4 right-4 z-10">
            <Button 
              variant="destructive"
              onClick={endSession}
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
