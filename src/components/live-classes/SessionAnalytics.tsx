
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionAnalyticsProps {
  sessionId: string;
}

export function SessionAnalytics({ sessionId }: SessionAnalyticsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch session details
  const { data: sessionDetails, isLoading: isLoadingSession } = useQuery({
    queryKey: ["session-details", sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_sessions")
        .select(`
          id,
          class_id,
          started_at,
          ended_at,
          participant_count,
          duration_seconds,
          status,
          classes:class_id (
            title,
            teacher_id,
            profiles:teacher_id (
              first_name,
              last_name
            )
          )
        `)
        .eq("id", sessionId)
        .single();

      if (error) {
        toast({
          title: "Error fetching session details",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      return data;
    },
    enabled: !!sessionId,
  });

  // Fetch participants for this session
  const { data: participants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ["session-participants", sessionId],
    queryFn: async () => {
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
  });

  // Calculate stats
  const calculateAttendanceTime = (join: string, leave: string | null) => {
    if (!leave) return 0;
    const joinTime = new Date(join).getTime();
    const leaveTime = new Date(leave).getTime();
    return Math.floor((leaveTime - joinTime) / 1000); // in seconds
  };

  // Format time in HH:MM:SS format
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSecs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (isLoadingSession || isLoadingParticipants) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sessionDetails) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Data Not Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The session details could not be loaded. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const teacherName = sessionDetails.classes?.profiles 
    ? `${sessionDetails.classes.profiles.first_name} ${sessionDetails.classes.profiles.last_name}` 
    : "Unknown Teacher";
    
  const totalDuration = sessionDetails.duration_seconds || 0;
  const averageAttendance = participants?.length > 0 
    ? participants.reduce((sum, p) => {
        return sum + calculateAttendanceTime(p.join_time, p.leave_time);
      }, 0) / participants.length 
    : 0;
    
  const attendanceRate = totalDuration > 0 ? (averageAttendance / totalDuration) * 100 : 0;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{sessionDetails.classes?.title || "Class Session"}</CardTitle>
            <p className="text-sm text-gray-500">Taught by {teacherName}</p>
          </div>
          <Badge variant={sessionDetails.status === "ended" ? "secondary" : "default"}>
            {sessionDetails.status.charAt(0).toUpperCase() + sessionDetails.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
            <Calendar className="h-5 w-5 text-gray-500 mb-1" />
            <span className="text-sm text-gray-500">Date</span>
            <span className="font-medium">
              {sessionDetails.started_at ? format(new Date(sessionDetails.started_at), "MMM d, yyyy") : "N/A"}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
            <Clock className="h-5 w-5 text-gray-500 mb-1" />
            <span className="text-sm text-gray-500">Duration</span>
            <span className="font-medium">{formatDuration(totalDuration)}</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
            <Users className="h-5 w-5 text-gray-500 mb-1" />
            <span className="text-sm text-gray-500">Participants</span>
            <span className="font-medium">{sessionDetails.participant_count || 0}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Average Attendance Time</span>
                <span className="text-sm font-medium">{formatDuration(Math.round(averageAttendance))}</span>
              </div>
              <Progress value={attendanceRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Peak Participants</span>
                <span className="text-sm font-medium">{sessionDetails.participant_count || 0}</span>
              </div>
              <Progress 
                value={((sessionDetails.participant_count || 0) / 30) * 100} 
                className="h-2" 
              />
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Session Timeline</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between py-1 border-t">
                  <span>Started</span>
                  <span>
                    {sessionDetails.started_at
                      ? format(new Date(sessionDetails.started_at), "h:mm a")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-t">
                  <span>Ended</span>
                  <span>
                    {sessionDetails.ended_at
                      ? format(new Date(sessionDetails.ended_at), "h:mm a")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance">
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Join Time</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Leave Time</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {participants && participants.length > 0 ? (
                    participants.map((participant: any) => {
                      const attendanceTime = calculateAttendanceTime(
                        participant.join_time, 
                        participant.leave_time
                      );
                      
                      return (
                        <tr key={participant.id}>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              <span>
                                {participant.profiles?.first_name} {participant.profiles?.last_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            {format(new Date(participant.join_time), "h:mm a")}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            {participant.leave_time 
                              ? format(new Date(participant.leave_time), "h:mm a") 
                              : "Still Active"}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            {formatDuration(attendanceTime)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-2 py-4 text-center text-sm text-gray-500">
                        No participant data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
