
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CreateClassForm } from "@/components/classes/CreateClassForm";
import { ClassCard } from "@/components/classes/ClassCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { Plus, Users, Book, MessageSquare, Calendar } from "lucide-react";

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
      const { data, error } = await supabase
        .from("classes")
        .select("*")
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
      <div className="animate-fade-up space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Welcome back, {profile?.first_name}
          </h1>
          <p className="text-gray-500">
            Here's an overview of your teaching dashboard
          </p>
        </div>

        {/* Stats Grid */}
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

        {/* Recent Messages */}
        <RecentMessages />

        {/* Classes Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Your Classes</h2>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Class
            </Button>
          </div>

          {showCreateForm && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Create New Class</h3>
              <CreateClassForm
                onSuccess={() => {
                  setShowCreateForm(false);
                  refetchClasses();
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {classes?.map((class_) => (
              <ClassCard
                key={class_.id}
                id={class_.id}
                title={class_.title}
                description={class_.description}
                startTime={class_.start_time}
                endTime={class_.end_time}
                classType={class_.class_type}
                teacherView
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
