
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Clock, Users, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

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

  // Fetch participants from the database
  const { data: participants } = useQuery({
    queryKey: ["session-participants", sessionInfo?.id],
    queryFn: async () => {
      if (!sessionInfo?.id) return [];
      
      const { data, error } = await supabase
        .from("session_participants")
        .select(`
          id,
          join_time,
          leave_time,
          user_id,
          profiles:user_id(
            first_name,
            last_name
          )
        `)
        .eq("session_id", sessionInfo.id);

      if (error) {
        toast({
          title: "Error fetching participants",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
    enabled: !!sessionInfo?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

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

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="bg-black/70 text-white hover:bg-black/80 border-gray-600"
          onClick={() => setShowAnalytics(!showAnalytics)}
        >
          <Users className="mr-2 h-4 w-4" />
          {participantCount} participant{participantCount !== 1 ? 's' : ''}
        </Button>
        
        <Button 
          variant="outline"
          className="bg-black/70 text-white hover:bg-black/80 border-gray-600"
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDuration(sessionDuration)}
        </Button>
        
        <Button 
          variant="destructive"
          onClick={() => endSession.mutate()}
          className="bg-red-600 hover:bg-red-700"
        >
          End Class Session
        </Button>
      </div>
      
      {showAnalytics && (
        <Card className="bg-black/70 text-white border-gray-600 w-72">
          <CardContent className="p-4 space-y-3">
            <div>
              <div className="text-sm flex justify-between mb-1">
                <span>Current participants:</span>
                <span>{participantCount}</span>
              </div>
              <Progress value={(participantCount / 30) * 100} className="h-1 bg-gray-700" />
            </div>
            
            <div>
              <div className="text-sm flex justify-between mb-1">
                <span>Peak participants:</span>
                <span>{peakParticipants}</span>
              </div>
              <Progress value={(peakParticipants / 30) * 100} className="h-1 bg-gray-700" />
            </div>
            
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span>Session duration:</span>
                <span>{formatDuration(sessionDuration)}</span>
              </div>
              <Progress 
                value={Math.min((sessionDuration / 3600) * 100, 100)} 
                className="h-1 bg-gray-700" 
              />
            </div>
            
            {participants && participants.length > 0 && (
              <div className="text-sm mt-2">
                <p className="mb-1">Recent participants:</p>
                <div className="max-h-24 overflow-y-auto">
                  {participants.slice(0, 5).map((p) => (
                    <div key={p.id} className="text-xs py-1 border-t border-gray-700">
                      {p.profiles.first_name} {p.profiles.last_name}
                    </div>
                  ))}
                </div>
                {participants.length > 5 && (
                  <div className="text-xs text-gray-400 mt-1">
                    +{participants.length - 5} more participants
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
