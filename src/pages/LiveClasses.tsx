
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { LiveClassRoom } from "@/components/live-classes/LiveClassRoom";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRole } from "@/hooks/use-user-role";
import { ActiveSessionsList } from "@/components/live-classes/ActiveSessionsList";
import { SessionHistoryList } from "@/components/live-classes/SessionHistoryList";
import { useSupabaseSubscription } from "@/hooks/use-supabase-subscription";

export default function LiveClasses() {
  const { classId } = useParams();
  const [isJoined, setIsJoined] = useState(false);
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

      return data;
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

      return data;
    },
    enabled: !!userRole,
  });

  // Use the custom hook for Supabase subscription
  useSupabaseSubscription('class_sessions', () => {
    refetchActiveSessions();
    refetchSessionHistory();
  });

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
            <ActiveSessionsList activeSessions={activeSessions} />
          </TabsContent>
          
          <TabsContent value="history">
            <SessionHistoryList sessionHistory={sessionHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
