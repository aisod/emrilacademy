
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { formatDuration } from "@/lib/format-utils";

interface SessionAnalyticsPanelProps {
  sessionId: string;
  participantCount: number;
  peakParticipants: number;
  sessionDuration: number;
}

export function SessionAnalyticsPanel({
  sessionId,
  participantCount,
  peakParticipants,
  sessionDuration,
}: SessionAnalyticsPanelProps) {
  const { toast } = useToast();

  // Fetch participants from the database
  const { data: participants } = useQuery({
    queryKey: ["session-participants", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      
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
        .eq("session_id", sessionId);

      if (error) {
        toast({
          title: "Error fetching participants",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    },
    enabled: !!sessionId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
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
              {participants.slice(0, 5).map((p: any) => (
                <div key={p.id} className="text-xs py-1 border-t border-gray-700">
                  {p.profiles?.first_name} {p.profiles?.last_name}
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
  );
}
