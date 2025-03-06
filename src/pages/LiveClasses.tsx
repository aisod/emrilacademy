
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { LiveClassRoom } from "@/components/live-classes/LiveClassRoom";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlayCircle, History, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useUserRole } from "@/hooks/use-user-role";

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

interface SessionHistoryItem {
  id: string;
  class_id: string;
  started_at: string | null;
  ended_at: string | null;
  participant_count: number;
  duration_seconds: number;
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
  const { data: userRole } = useUserRole();

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

  const { 
    data: sessionHistory,
    refetch: refetchSessionHistory
  } = useQuery({
    queryKey: ["session-history"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      let query = supabase
        .from("class_sessions")
        .select(`
          id,
          class_id,
          started_at,
          ended_at,
          participant_count,
          duration_seconds,
          class:classes(
            title,
            teacher:profiles!teacher_id(
              first_name,
              last_name
            )
          )
        `)
        .eq("is_active", false)
        .eq("status", "ended")
        .order("ended_at", { ascending: false });
      
      // If teacher, get sessions for classes they teach
      if (userRole === "teacher") {
        const { data: teacherClasses } = await supabase
          .from("classes")
          .select("id")
          .eq("teacher_id", session.user.id);
        
        if (teacherClasses && teacherClasses.length > 0) {
          query = query.in("class_id", teacherClasses.map(c => c.id));
        } else {
          return [];
        }
      } 
      // If student, get sessions they participated in
      else if (userRole === "student") {
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select("class_id")
          .eq("student_id", session.user.id);
        
        if (enrollments && enrollments.length > 0) {
          query = query.in("class_id", enrollments.map(e => e.class_id));
        } else {
          return [];
        }
      }

      const { data, error } = await query.limit(10);

      if (error) {
        toast({
          title: "Error fetching session history",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data as SessionHistoryItem[];
    },
    enabled: !!userRole,
  });

  useEffect(() => {
    // Subscribe to class_sessions changes
    const channel = supabase.channel('active-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_sessions',
        },
        () => {
          // Refetch active sessions when any changes occur
          refetchActiveSessions();
          refetchSessionHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchActiveSessions, refetchSessionHistory]);

  const handleJoinClass = (selectedClassId: string) => {
    navigate(`/live-classes/${selectedClassId}`);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
        <h1 className="text-2xl font-bold mb-6">Live Class Sessions</h1>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Sessions</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
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
          </TabsContent>
          
          <TabsContent value="history">
            {!sessionHistory || sessionHistory.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Session History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>You don't have any past class sessions. When you participate in a class, it will be shown here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessionHistory.map((session) => (
                  <Card key={session.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{session.class.title}</CardTitle>
                      <p className="text-sm text-gray-500">
                        by {session.class.teacher.first_name} {session.class.teacher.last_name}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span>Completed</span>
                        </div>
                        {session.started_at && session.ended_at && (
                          <p className="text-sm text-gray-600">
                            {format(new Date(session.started_at), "MMM d, yyyy · h:mm a")}
                          </p>
                        )}
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <div>
                            <span className="font-medium">Duration:</span> {formatDuration(session.duration_seconds || 0)}
                          </div>
                          <div>
                            <span className="font-medium">Participants:</span> {session.participant_count || 0}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
