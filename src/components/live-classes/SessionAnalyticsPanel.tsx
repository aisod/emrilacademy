
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { formatDuration } from "@/lib/format-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  const { data: participants, isLoading, error } = useQuery({
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
        throw error;
      }

      return data || [];
    },
    enabled: !!sessionId,
    refetchInterval: 30000, // Refetch every 30 seconds
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error fetching participants",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
      }
    }
  });

  // Helper function to render participant metrics section
  const renderMetricSection = (label: string, value: number, maxValue: number, unit?: string) => (
    <div>
      <div className="text-sm flex justify-between mb-1">
        <span>{label}</span>
        <span>{unit ? `${value} ${unit}` : value}</span>
      </div>
      <Progress value={(value / maxValue) * 100} className="h-1 bg-gray-700" />
    </div>
  );

  if (error) {
    return (
      <Card className="bg-black/70 text-white border-gray-600 w-72">
        <CardContent className="p-4">
          <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-white">
            <AlertTitle>Error loading analytics</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load participant data"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/70 text-white border-gray-600 w-72">
      <CardContent className="p-4 space-y-3">
        {renderMetricSection("Current participants:", participantCount, 30)}
        {renderMetricSection("Peak participants:", peakParticipants, 30)}
        
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
        
        {isLoading ? (
          <div className="space-y-2 mt-2">
            <p className="text-sm mb-1">Recent participants:</p>
            <Skeleton className="h-4 w-full bg-gray-700/50" />
            <Skeleton className="h-4 w-full bg-gray-700/50" />
            <Skeleton className="h-4 w-full bg-gray-700/50" />
          </div>
        ) : participants && participants.length > 0 ? (
          <div className="text-sm mt-2">
            <p className="mb-1">Recent participants:</p>
            <div className="max-h-24 overflow-y-auto">
              {participants.slice(0, 5).map((p: any) => (
                <div key={p.id} className="text-xs py-1 border-t border-gray-700">
                  {p.profiles?.first_name} {p.profiles?.last_name || 'Unknown'}
                </div>
              ))}
            </div>
            {participants.length > 5 && (
              <div className="text-xs text-gray-400 mt-1">
                +{participants.length - 5} more participants
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-400 mt-2">
            No participants data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
