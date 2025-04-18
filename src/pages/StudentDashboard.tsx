
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { ClassCalendar } from "@/components/calendar/ClassCalendar";
import { Book, MessageSquare, FileText, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery({
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

  const { data: stats, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ["student-stats"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      try {
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
      } catch (error) {
        console.error("Error fetching student stats:", error);
        throw error;
      }
    },
  });

  const { data: nextClass, isLoading: isLoadingNextClass, error: nextClassError } = useQuery({
    queryKey: ["next-class"],
    queryFn: async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching next class:", error);
        throw error;
      }
    },
  });

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-profile"] }),
        queryClient.invalidateQueries({ queryKey: ["student-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["next-class"] }),
      ]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);  // Ensure user sees refresh animation
    }
  };
  
  // Check for any errors
  const hasErrors = profileError || statsError || nextClassError;

  const queryClient = useQuery().client;

  return (
    <DashboardLayout requiredRole="student">
      <div className="animate-fade-up space-y-6">
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {isLoadingProfile ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                `Welcome, ${profile?.first_name || "Student"}!`
              )}
            </h1>
            <Button 
              size="sm"
              variant="ghost" 
              onClick={refreshData}
              disabled={isRefreshing || isLoadingStats || isLoadingNextClass}
              className="h-8 w-8 p-1"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh data</span>
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
            Here's an overview of your learning journey
          </p>
        </div>

        {hasErrors && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 rounded-lg text-red-700 dark:text-red-300">
            <h3 className="font-medium mb-1">Error loading dashboard data</h3>
            <p className="text-sm">
              Please try refreshing the page. If the problem persists, contact support.
            </p>
          </div>
        )}

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

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-white">Class Schedule</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <ClassCalendar role="student" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
