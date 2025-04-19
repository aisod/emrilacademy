
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock } from "lucide-react";
import { format, isPast, differenceInDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function UpcomingAssignments() {
  const navigate = useNavigate();
  
  const { data: assignments, isLoading } = useQuery({
    queryKey: ["upcoming-assignments"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      // Get enrolled courses for the student
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("class_id")
        .eq("student_id", session.user.id);
      
      if (!enrollments?.length) return [];
      
      // Get all assessments for the enrolled courses
      const { data: assessments } = await supabase
        .from("assessments")
        .select(`
          id,
          title,
          description,
          due_date,
          type,
          course_id,
          courses (title, slug)
        `)
        .in("course_id", enrollments.map(e => e.class_id))
        .order("due_date", { ascending: true })
        .limit(5);
      
      return assessments || [];
    },
  });
  
  if (isLoading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-gray-900 dark:text-white">
            Upcoming Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const hasAssignments = assignments && assignments.length > 0;
  
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-gray-900 dark:text-white">
          Upcoming Assignments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!hasAssignments ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            No upcoming assignments
          </p>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const dueDate = new Date(assignment.due_date);
              const isPastDue = isPast(dueDate);
              const daysRemaining = differenceInDays(dueDate, new Date());
              
              return (
                <div 
                  key={assignment.id} 
                  className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {assignment.courses.title}
                      </p>
                    </div>
                    <Badge 
                      variant={isPastDue ? "destructive" : daysRemaining <= 2 ? "outline" : "secondary"}
                      className={isPastDue ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : 
                        daysRemaining <= 2 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" : ""}
                    >
                      {isPastDue ? 'Past Due' : daysRemaining === 0 ? 'Due Today' : `${daysRemaining} days left`}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{format(dueDate, "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{format(dueDate, "h:mm a")}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <Button 
              variant="outline" 
              className="w-full mt-2" 
              size="sm"
              onClick={() => navigate("/courses")}
            >
              View All Assignments
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
