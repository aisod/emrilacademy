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

      if (role === "teacher") {
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
      <div className="p-4 rounded-lg border border-card-border bg-white shadow-card space-y-3 hover:bg-card-hover transition-colors">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-text-DEFAULT text-base">{classItem.title}</h4>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={hasReminder ? "default" : "outline"} 
                  size="sm"
                  className="flex items-center gap-1 shadow-sm"
                >
                  <Bell className="h-4 w-4" />
                  <span className="font-medium">{hasReminder ? "Reminder Set" : "Set Reminder"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white shadow-dropdown border-card-border">
                <DropdownMenuItem className="hover:bg-calendar-hover" onClick={() => handleSetReminder("15_minutes")}>
                  15 minutes before
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-calendar-hover" onClick={() => handleSetReminder("30_minutes")}>
                  30 minutes before
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-calendar-hover" onClick={() => handleSetReminder("1_hour")}>
                  1 hour before
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Badge variant="outline" className="bg-calendar-today text-text-DEFAULT font-medium">
              {format(new Date(classItem.start_time), "h:mm a")}
            </Badge>
          </div>
        </div>
        {role === "student" && (
          <p className="text-sm text-text-muted">
            Teacher: {classItem.teacher.first_name} {classItem.teacher.last_name}
          </p>
        )}
      </div>
    );
  }

  return (
    <Card className="flex-1 border-card-border shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            className="rounded-lg border border-card-border bg-calendar p-6 shadow-sm w-full lg:w-auto"
            classNames={{
              months: "space-y-4",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-base font-medium text-text-DEFAULT",
              nav: "space-x-1 flex items-center",
              nav_button: "h-8 w-8 bg-transparent p-0 hover:bg-calendar-hover rounded-md text-text-muted",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "w-9 font-medium text-text-muted rounded-md",
              row: "flex w-full mt-2",
              cell: "w-9 h-9 text-center text-sm relative p-0 hover:bg-calendar-hover rounded-md",
              day: "h-9 w-9 p-0 font-normal text-text-DEFAULT hover:bg-calendar-hover rounded-md",
              day_today: "bg-calendar-today text-text-DEFAULT font-semibold hover:bg-calendar-hover",
              day_selected: "bg-calendar-selected text-calendar-text-selected hover:bg-calendar-selected hover:text-calendar-text-selected focus:bg-calendar-selected focus:text-calendar-text-selected",
              day_outside: "text-text-muted opacity-50",
              day_disabled: "text-text-muted opacity-50",
              day_hidden: "invisible",
            }}
          />

          <div className="flex-1 space-y-4">
            <h3 className="font-heading text-xl font-semibold text-text-DEFAULT">
              Classes for {format(date, "MMMM d, yyyy")}
            </h3>
            {classesForSelectedDate.length === 0 ? (
              <p className="text-text-muted">No classes scheduled</p>
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
