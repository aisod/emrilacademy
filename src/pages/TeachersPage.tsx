
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TeacherList } from "@/components/teachers/TeacherList";
import { Users } from "lucide-react";

export default function TeachersPage() {
  const { data: teachers, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url")
        .eq("role", "teacher");
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                Our Teachers
              </CardTitle>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Meet our experienced and dedicated teaching staff
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <TeacherList teachers={teachers || []} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
