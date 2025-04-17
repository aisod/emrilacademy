
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { ClassCalendar } from "@/components/calendar/ClassCalendar";
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
        .select(`
          *,
          enrollments!inner(student_id)
        `)
        .eq('enrollments.student_id', session.user.id)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  return (
    <DashboardLayout requiredRole="student">
      <div className="animate-fade-up space-y-6">
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {profile?.first_name || "Student"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">Here's an overview of your learning journey</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Class Schedule</h2>
          <div className="overflow-x-auto">
            <ClassCalendar role="student" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
