
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { CreateClassForm } from "@/components/classes/CreateClassForm";
import { ClassCard } from "@/components/classes/ClassCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TeacherDashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: classes, refetch } = useQuery({
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

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="animate-fade-up space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Class
          </Button>
        </div>

        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Create New Class</h2>
            <CreateClassForm
              onSuccess={() => {
                setShowCreateForm(false);
                refetch();
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </DashboardLayout>
  );
}
