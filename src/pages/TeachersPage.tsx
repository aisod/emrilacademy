
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TeacherList } from "@/components/teachers/TeacherList";

export default function TeachersPage() {
  const { data: teachers, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, bio, avatar_url")
        .eq("role", "teacher");
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="border-2 border-gray-400 shadow-lg bg-white">
          <CardHeader className="border-b-2 border-gray-400">
            <CardTitle className="text-xl font-heading font-bold text-gray-900">
              Our Teachers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <TeacherList teachers={teachers || []} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
