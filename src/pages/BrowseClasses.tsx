
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ClassList } from "@/components/classes/ClassList";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function BrowseClasses() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: classes, isLoading } = useQuery({
    queryKey: ["available-classes", searchQuery],
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
          enrolled:enrollments(student_id)
        `)
        .ilike("title", `%${searchQuery}%`)
        .order("start_time");

      if (error) throw error;

      // Map the classes with enrollment status using the current user's ID from session
      return data.map(class_ => ({
        ...class_,
        isEnrolled: class_.enrolled?.some(e => e.student_id === session.user.id)
      }));
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ClassList classes={classes || []} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
