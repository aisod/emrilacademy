
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { LiveClassRoom } from "@/components/live-classes/LiveClassRoom";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface ActiveClassSession {
  id: string;
  class_id: string;
  is_active: boolean;
  started_at: string | null;
  status: 'pending' | 'active' | 'ended';
  class: {
    title: string;
    teacher: {
      first_name: string;
      last_name: string;
    };
  };
}

export default function LiveClasses() {
  const { classId } = useParams();
  const [isJoined, setIsJoined] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: classDetails } = useQuery({
    queryKey: ["class-details", classId],
    queryFn: async () => {
      if (!classId) return null;
      const { data } = await supabase
        .from("classes")
        .select(`
          *,
          teacher:profiles!teacher_id(
            first_name,
            last_name
          )
        `)
        .eq("id", classId)
        .single();
      return data;
    },
    enabled: !!classId,
  });

  const { 
    data: activeSessions,
    refetch: refetchActiveSessions
  } = useQuery({
    queryKey: ["active-class-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_sessions")
        .select(`
          id,
          class_id,
          is_active,
          started_at,
          status,
          class:classes(
            title,
            teacher:profiles!teacher_id(
              first_name,
              last_name
            )
          )
        `)
        .eq("is_active", true)
        .eq("status", "active");

      if (error) {
        toast({
          title: "Error fetching active classes",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data as ActiveClassSession[];
    },
  });

  useEffect(() => {
    // Subscribe to class_sessions changes
    const channel = supabase.channel('active-sessions')
      .on(
        'postgres_changes' as const,
        {
          event: '*',
          schema: 'public',
          table: 'class_sessions',
          filter: 'is_active=eq.true',
        },
        () => {
          // Refetch active sessions when any changes occur
          refetchActiveSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchActiveSessions]);

  const handleJoinClass = (selectedClassId: string) => {
    navigate(`/live-classes/${selectedClassId}`);
  };

  if (classId) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-4rem)]">
          <LiveClassRoom
            classId={classId}
            className={classDetails?.title}
            teacherName={`${classDetails?.teacher?.first_name} ${classDetails?.teacher?.last_name}`}
            isJoined={isJoined}
            onJoinStatusChange={setIsJoined}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Live Classes</h1>

        {!activeSessions || activeSessions.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Active Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>There are no live classes in session right now. Check back later or browse available classes.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSessions.map((session) => (
              <Card key={session.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{session.class.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    by {session.class.teacher.first_name} {session.class.teacher.last_name}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                      Live
                    </span>
                    {session.started_at && 
                      `Started at ${new Date(session.started_at).toLocaleTimeString()}`
                    }
                  </p>
                  <Button
                    onClick={() => handleJoinClass(session.class_id)}
                    className="w-full"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Join Live Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
