
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { Users, Book, MessageSquare, Calendar } from "lucide-react";
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { ClassCalendar } from "@/components/calendar/ClassCalendar";

export default function TeacherDashboard() {
  const { data: profile } = useQuery({
    queryKey: ["teacher-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: classes, refetch: refetchClasses } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          enrollments:enrollments(count)
        `)
        .eq("teacher_id", session.user.id)
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: resourceCount } = useQuery({
    queryKey: ["teacher-resource-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("resources")
        .select("*", { count: "exact", head: true })
        .in(
          "class_id",
          classes?.map((c) => c.id) || []
        );

      if (error) throw error;
      return count || 0;
    },
    enabled: !!classes?.length,
  });

  const { data: studentCount } = useQuery({
    queryKey: ["teacher-student-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .in(
          "class_id",
          classes?.map((c) => c.id) || []
        );

      if (error) throw error;
      return count || 0;
    },
    enabled: !!classes?.length,
  });

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="animate-fade-up space-y-4 md:space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.first_name}
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
            Here's an overview of your teaching dashboard
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatsCard
            title="Classes"
            value={classes?.length}
            icon={Calendar}
            isLoading={!classes}
          />
          <StatsCard
            title="Students"
            value={studentCount}
            icon={Users}
            isLoading={!studentCount}
          />
          <StatsCard
            title="Resources"
            value={resourceCount}
            icon={Book}
            isLoading={!resourceCount}
          />
          <StatsCard
            title="Messages"
            value={0}
            icon={MessageSquare}
            isLoading={false}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <NextClassCard />
          <RecentMessages />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Class Schedule</h2>
          <ClassCalendar role="teacher" />
        </div>
      </div>
    </DashboardLayout>
  );
}
