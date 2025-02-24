
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Clock, Users, Video, PlayCircle, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

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
  capacity: number;
  enrolled: { student_id: string }[];
  isEnrolled?: boolean;
}

interface ClassListProps {
  classes: Class[];
  isLoading: boolean;
}

export function ClassList({ classes, isLoading }: ClassListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

      if (error) {
        if (error.message.includes("maximum capacity")) {
          throw new Error("This class has reached its maximum capacity");
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "Successfully enrolled in class",
      });

      queryClient.invalidateQueries({ queryKey: ["available-classes"] });
      queryClient.invalidateQueries({ queryKey: ["student-stats"] });
      queryClient.invalidateQueries({ queryKey: ["next-class"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const isClassInProgress = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return false;
    const now = new Date();
    const classStart = new Date(startTime);
    const classEnd = new Date(endTime);
    return now >= classStart && now <= classEnd;
  };

  const getClassStatus = (startTime: string | null, endTime: string | null) => {
    if (!startTime) return null;
    const now = new Date();
    const classStart = new Date(startTime);
    const classEnd = endTime ? new Date(endTime) : null;
    
    if (now < classStart) {
      return <Badge variant="outline">Upcoming</Badge>;
    } else if (classEnd && now > classEnd) {
      return <Badge variant="secondary">Completed</Badge>;
    } else {
      return <Badge variant="default">In Progress</Badge>;
    }
  };

  const handleJoinLiveClass = (classId: string) => {
    navigate(`/live-classes/${classId}`);
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
        <Card key={class_.id} className="overflow-hidden">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle>{class_.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  by {class_.teacher.first_name} {class_.teacher.last_name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {class_.class_type === "live" ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <PlayCircle className="w-3 h-3" />
                    Live
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Recorded
                  </Badge>
                )}
                {getClassStatus(class_.start_time, class_.end_time)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {class_.description && (
              <p className="text-gray-600 text-sm">{class_.description}</p>
            )}
            <div className="space-y-2">
              {class_.start_time && (
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{format(new Date(class_.start_time), "MMMM d, yyyy")}</span>
                </div>
              )}
              {class_.start_time && class_.end_time && (
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    {format(new Date(class_.start_time), "h:mm a")} -{" "}
                    {format(new Date(class_.end_time), "h:mm a")}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{class_.enrollments[0]?.count || 0} students enrolled</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Resources available</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Class capacity</span>
                  <span>{class_.enrollments[0]?.count || 0}/{class_.capacity}</span>
                </div>
                <Progress 
                  value={((class_.enrollments[0]?.count || 0) / class_.capacity) * 100} 
                  className="h-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              {class_.isEnrolled ? (
                <>
                  {class_.class_type === "live" && 
                   isClassInProgress(class_.start_time, class_.end_time) && (
                    <Button 
                      onClick={() => handleJoinLiveClass(class_.id)}
                      className="w-full"
                      variant="default"
                    >
                      Join Live Class
                    </Button>
                  )}
                  <Button variant="secondary" className="w-full" disabled>
                    Already Enrolled
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => handleEnroll(class_.id)}
                  className="w-full"
                  disabled={(class_.enrollments[0]?.count || 0) >= class_.capacity}
                >
                  {(class_.enrollments[0]?.count || 0) >= class_.capacity
                    ? "Class Full"
                    : "Enroll Now"
                  }
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
