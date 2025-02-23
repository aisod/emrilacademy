
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ClassList } from "@/components/classes/ClassList";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function BrowseClasses() {
  const { data: classes, isLoading } = useQuery({
    queryKey: ["available-classes"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          teacher:profiles!teacher_id(
            first_name,
            last_name
          ),
          enrollments:enrollments(count),
          enrolled:enrollments!inner(student_id)
        `)
        .eq("enrolled.student_id", session.user.id)
        .order("start_time");

      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Classes</h1>
          <p className="text-gray-500 mt-1">
            Discover and enroll in available classes
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search classes..."
            className="pl-10"
          />
        </div>

        <ClassList classes={classes || []} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
