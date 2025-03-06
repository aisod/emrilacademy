
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SessionDetails } from "./SessionDetails";
import { SessionOverview } from "./SessionOverview";
import { ParticipantTable } from "./ParticipantTable";
import { SessionLoadingState } from "./SessionLoadingState";

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
      try {
        // First, get the session participants
        const { data: participantsData, error: participantsError } = await supabase
          .from("session_participants")
          .select(`
            id,
            join_time,
            leave_time,
            user_id
          `)
          .eq("session_id", sessionId);

        if (participantsError) {
          throw participantsError;
        }

        // Then, for each participant, fetch their profile information separately
        const participantsWithProfiles = await Promise.all(
          (participantsData || []).map(async (participant) => {
            // Fetch user profile data
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("first_name, last_name")
              .eq("id", participant.user_id)
              .maybeSingle();

            // Return combined data
            return {
              ...participant,
              // Use null coalescence to handle the case where profile data isn't available
              profiles: profileError ? undefined : profileData
            };
          })
        );

        return participantsWithProfiles || [];
      } catch (error) {
        toast({
          title: "Error fetching participants",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
        return [];
      }
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

  if (isLoadingSession || isLoadingParticipants) {
    return <SessionLoadingState />;
  }

  if (!sessionDetails) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Session Data Not Available</h3>
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
        <SessionDetails 
          sessionDetails={sessionDetails} 
          teacherName={teacherName} 
          totalDuration={totalDuration} 
        />
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <SessionOverview 
              averageAttendance={averageAttendance}
              attendanceRate={attendanceRate}
              participantCount={sessionDetails.participant_count || 0}
              sessionDetails={sessionDetails}
            />
          </TabsContent>
          
          <TabsContent value="attendance">
            <ParticipantTable 
              participants={participants || []} 
              calculateAttendanceTime={calculateAttendanceTime} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
