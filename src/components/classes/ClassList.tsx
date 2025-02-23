
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Clock, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Class {
  id: string;
  title: string;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  class_type: "live" | "recorded";
  teacher: {
    first_name: string;
    last_name: string;
  };
  enrollments: { count: number }[];
  enrolled: { student_id: string }[];
}

interface ClassListProps {
  classes: Class[];
  isLoading: boolean;
}

export function ClassList({ classes, isLoading }: ClassListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleEnroll = async (classId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please sign in to enroll");

      const { error } = await supabase
        .from("enrollments")
        .insert({
          class_id: classId,
          student_id: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully enrolled in class",
      });

      // Refetch classes to update enrollment status
      queryClient.invalidateQueries({ queryKey: ["available-classes"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!classes.length) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">No classes available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((class_) => (
        <Card key={class_.id}>
          <CardHeader>
            <CardTitle>{class_.title}</CardTitle>
            <p className="text-sm text-gray-500">
              by {class_.teacher.first_name} {class_.teacher.last_name}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {class_.description && (
              <p className="text-gray-600">{class_.description}</p>
            )}
            <div className="space-y-2">
              {class_.start_time && (
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{format(new Date(class_.start_time), "MMMM d, yyyy")}</span>
                </div>
              )}
              {class_.start_time && class_.end_time && (
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    {format(new Date(class_.start_time), "h:mm a")} -{" "}
                    {format(new Date(class_.end_time), "h:mm a")}
                  </span>
                </div>
              )}
              <div className="flex items-center text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                <span>{class_.enrollments[0]?.count || 0} students enrolled</span>
              </div>
            </div>
            {class_.enrolled?.length > 0 ? (
              <Button variant="secondary" className="w-full" disabled>
                Already Enrolled
              </Button>
            ) : (
              <Button
                onClick={() => handleEnroll(class_.id)}
                className="w-full"
              >
                Enroll Now
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
