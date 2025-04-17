
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CreateClassForm } from "@/components/classes/CreateClassForm";
import { ClassCard } from "@/components/classes/ClassCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { EnrolledStudentsList } from "@/components/dashboard/EnrolledStudentsList";
import { Plus, Users, Book, MessageSquare, Calendar } from "lucide-react";
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { ClassCalendar } from "@/components/calendar/ClassCalendar";

export default function TeacherDashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);

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
    <DashboardLayout requiredRole="teacher">
      <div className="animate-fade-up space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.first_name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Here's an overview of your teaching dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Classes"
            value={classes?.length}
            icon={Calendar}
            isLoading={!classes}
          />
          <StatsCard
            title="Total Students"
            value={studentCount}
            icon={Users}
            isLoading={!studentCount}
          />
          <StatsCard
            title="Resources Uploaded"
            value={resourceCount}
            icon={Book}
            isLoading={!resourceCount}
          />
          <StatsCard
            title="Unread Messages"
            value={0}
            icon={MessageSquare}
            isLoading={false}
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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Class Schedule</h2>
          <ClassCalendar role="teacher" />
        </div>
      </div>
    </DashboardLayout>
  );
}
