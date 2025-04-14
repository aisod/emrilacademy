
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useClassReminders, ReminderInterval } from "@/hooks/use-class-reminders";
import { useSupabaseSubscription } from "@/hooks/use-supabase-subscription";

interface ClassCalendarProps {
  role: "student" | "teacher";
}

export function ClassCalendar({ role }: ClassCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());
  const { toast } = useToast();

  const { data: classes = [], refetch } = useQuery({
    queryKey: ["calendar-classes", role, date],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      // Fixed query construction to properly chain methods
      if (role === "teacher") {
        // Query for teacher
        const { data, error } = await supabase
          .from("classes")
          .select(`
            *,
            teacher:profiles!teacher_id(
              first_name,
              last_name
            )
          `)
          .eq("teacher_id", session.user.id);

        if (error) throw error;
        return data;
      } else {
        // Query for student
        const { data, error } = await supabase
          .from("classes")
          .select(`
            *,
            teacher:profiles!teacher_id(
              first_name,
              last_name
            ),
            enrolled:enrollments!inner(student_id)
          `)
          .eq("enrolled.student_id", session.user.id);

        if (error) throw error;
        return data;
      }
    },
  });

  useSupabaseSubscription(
    'class_reminders',
    () => {
      refetch();
    }
  );

  const classesForSelectedDate = classes.filter(
    (c) => c.start_time && format(new Date(c.start_time), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  function ClassCard({ classItem }: { classItem: any }) {
    const { reminders, createReminder } = useClassReminders(classItem.id);
    
    const handleSetReminder = async (interval: ReminderInterval) => {
      try {
        await createReminder.mutateAsync(interval);
      } catch (error) {
        console.error("Error setting reminder:", error);
      }
    };

    const hasReminder = reminders.some(r => !r.sent_at);

    return (
      <div key={classItem.id} className="p-4 rounded-lg border space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{classItem.title}</h4>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={hasReminder ? "default" : "outline"} 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Bell className="h-4 w-4" />
                  {hasReminder ? "Reminder Set" : "Set Reminder"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSetReminder("15_minutes")}>
                  15 minutes before
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetReminder("30_minutes")}>
                  30 minutes before
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetReminder("1_hour")}>
                  1 hour before
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Badge variant="outline">
              {format(new Date(classItem.start_time), "h:mm a")}
            </Badge>
          </div>
        </div>
        {role === "student" && (
          <p className="text-sm text-muted-foreground">
            Teacher: {classItem.teacher.first_name} {classItem.teacher.last_name}
          </p>
        )}
      </div>
    );
  }

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
                  <ClassCard key={class_.id} classItem={class_} />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
