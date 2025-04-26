
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, GraduationCap, BookOpen, School } from "lucide-react";

export function AdminStats() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [students, teachers, courses, classes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "teacher"),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("classes").select("id", { count: "exact", head: true })
      ]);

      return {
        students: students.count || 0,
        teachers: teachers.count || 0,
        courses: courses.count || 0,
        classes: classes.count || 0
      };
    }
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatsCard
        title="Students"
        value={stats?.students}
        icon={GraduationCap}
        isLoading={!stats}
      />
      <StatsCard
        title="Teachers"
        value={stats?.teachers}
        icon={Users}
        isLoading={!stats}
      />
      <StatsCard
        title="Courses"
        value={stats?.courses}
        icon={BookOpen}
        isLoading={!stats}
      />
      <StatsCard
        title="Classes"
        value={stats?.classes}
        icon={School}
        isLoading={!stats}
      />
    </div>
  );
}
