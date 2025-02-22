
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ClassCard } from "@/components/classes/ClassCard";
import { MessageList } from "@/components/messages/MessageList";
import { SendMessage } from "@/components/messages/SendMessage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export default function StudentDashboard() {
  const { toast } = useToast();

  const { data: enrollments } = useQuery({
    queryKey: ["student-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("class_id");
      if (error) throw error;
      return data.map((e) => e.class_id);
    },
  });

  const { data: classes, refetch } = useQuery({
    queryKey: ["available-classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const handleEnroll = async (classId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      const { error } = await supabase
        .from("enrollments")
        .insert({ 
          class_id: classId,
          student_id: session.user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully enrolled in class",
      });

      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="animate-fade-up space-y-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Send Message</h2>
            <SendMessage />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <MessageList />
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">Available Classes</h2>
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
                  isEnrolled={enrollments?.includes(class_.id)}
                  onEnroll={() => handleEnroll(class_.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
