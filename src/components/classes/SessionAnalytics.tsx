
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface SessionAnalyticsProps {
  classId: string;
}

export function SessionAnalytics({ classId }: SessionAnalyticsProps) {
  const { data: sessionData, isLoading } = useQuery({
    queryKey: ["session-analytics", classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_sessions")
        .select(`
          id, 
          started_at, 
          ended_at, 
          duration_seconds, 
          participant_count,
          session_participants:session_participants(count)
        `)
        .eq("class_id", classId)
        .order("started_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!sessionData?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No session data available yet.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = sessionData.map(session => ({
    date: format(new Date(session.started_at || new Date()), "MMM d"),
    duration: Math.round((session.duration_seconds || 0) / 60), // Convert to minutes
    participants: session.participant_count || 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="duration" name="Duration (mins)" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="participants" name="Participants" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
