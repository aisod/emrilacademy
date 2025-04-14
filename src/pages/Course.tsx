
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAssessments } from "@/hooks/use-assessments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Course() {
  const { slug } = useParams<{ slug: string }>();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { assessments, isLoading: assessmentsLoading } = useAssessments(course?.id || "");

  if (courseLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center">Course not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-gray-500 mt-2">{course.description}</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              {assessmentsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : assessments.length === 0 ? (
                <p className="text-muted-foreground">No assessments available yet.</p>
              ) : (
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <h3 className="font-medium">{assessment.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(assessment.due_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm">Type: {assessment.type}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
