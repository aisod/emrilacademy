
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { Book, MessageSquare, FileText } from "lucide-react";

export default function StudentDashboard() {
  const { data: profile } = useQuery({
    queryKey: ["student-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["student-stats"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      const [enrollmentsResponse, messagesResponse] = await Promise.all([
        supabase
          .from("enrollments")
          .select("class_id", { count: "exact" })
          .eq("student_id", session.user.id),
        supabase
          .from("messages")
          .select("id", { count: "exact" })
          .eq("receiver_id", session.user.id)
          .is("read_at", null),
      ]);

      if (enrollmentsResponse.error) throw enrollmentsResponse.error;
      if (messagesResponse.error) throw messagesResponse.error;

      return {
        upcomingClasses: enrollmentsResponse.count || 0,
        unreadMessages: messagesResponse.count || 0,
        resourcesCount: 0, // Placeholder for future resources feature
      };
    },
  });

  const { data: nextClass, isLoading: isLoadingNextClass } = useQuery({
    queryKey: ["next-class"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  return (
    <DashboardLayout requiredRole="student">
      <div className="animate-fade-up space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {profile?.first_name || "Student"}!
          </h1>
          <p className="text-gray-500 mt-1">Here's an overview of your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Upcoming Classes"
            value={stats?.upcomingClasses}
            icon={Book}
            isLoading={isLoadingStats}
          />
          <StatsCard
            title="Unread Messages"
            value={stats?.unreadMessages}
            icon={MessageSquare}
            isLoading={isLoadingStats}
          />
          <StatsCard
            title="Resources"
            value={stats?.resourcesCount}
            icon={FileText}
            isLoading={isLoadingStats}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NextClassCard
            title={nextClass?.title}
            startTime={nextClass?.start_time}
            endTime={nextClass?.end_time}
            isLoading={isLoadingNextClass}
          />
          <RecentMessages />
        </div>
      </div>
    </DashboardLayout>
  );
}
