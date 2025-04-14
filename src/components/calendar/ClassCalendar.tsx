
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ClassCalendarProps {
  role: "student" | "teacher";
}

export function ClassCalendar({ role }: ClassCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());

  const { data: classes = [] } = useQuery({
    queryKey: ["calendar-classes", role, date],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      let query = supabase
        .from("classes")
        .select(`
          *,
          teacher:profiles!teacher_id(
            first_name,
            last_name
          )
        `);

      if (role === "teacher") {
        query = query.eq("teacher_id", session.user.id);
      } else {
        query = query
          .select(`
            *,
            teacher:profiles!teacher_id(
              first_name,
              last_name
            ),
            enrolled:enrollments!inner(student_id)
          `)
          .eq("enrolled.student_id", session.user.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const classesForSelectedDate = classes.filter(
    (c) => c.start_time && format(new Date(c.start_time), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Your Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-8">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            className="rounded-md border w-full lg:w-auto"
          />

          <div className="flex-1 space-y-4">
            <h3 className="font-semibold">
              Classes for {format(date, "MMMM d, yyyy")}
            </h3>
            {classesForSelectedDate.length === 0 ? (
              <p className="text-muted-foreground">No classes scheduled</p>
            ) : (
              <div className="space-y-4">
                {classesForSelectedDate.map((class_) => (
                  <div
                    key={class_.id}
                    className="p-4 rounded-lg border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{class_.title}</h4>
                      <Badge variant="outline">
                        {format(new Date(class_.start_time), "h:mm a")}
                      </Badge>
                    </div>
                    {role === "student" && (
                      <p className="text-sm text-muted-foreground">
                        Teacher: {class_.teacher.first_name} {class_.teacher.last_name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
