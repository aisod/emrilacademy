
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type ReminderInterval = '1_hour' | '30_minutes' | '15_minutes';

export interface ClassReminder {
  id: string;
  class_id: string;
  reminder_time: string;
  interval: ReminderInterval;
  sent_at: string | null;
}

export function useClassReminders(classId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ["class-reminders", classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_reminders")
        .select("*")
        .eq("class_id", classId);

      if (error) throw error;
      return data as ClassReminder[];
    },
  });

  const createReminder = useMutation({
    mutationFn: async (interval: ReminderInterval) => {
      const { data: classData, error: classError } = await supabase
        .from("classes")
        .select("start_time")
        .eq("id", classId)
        .single();

      if (classError) throw classError;

      const reminderTime = new Date(classData.start_time);
      switch (interval) {
        case "1_hour":
          reminderTime.setHours(reminderTime.getHours() - 1);
          break;
        case "30_minutes":
          reminderTime.setMinutes(reminderTime.getMinutes() - 30);
          break;
        case "15_minutes":
          reminderTime.setMinutes(reminderTime.getMinutes() - 15);
          break;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      const { error } = await supabase
        .from("class_reminders")
        .insert({
          class_id: classId,
          user_id: session.user.id,
          reminder_time: reminderTime.toISOString(),
          interval,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-reminders", classId] });
      toast({
        title: "Reminder set",
        description: "You will be notified before the class starts.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to set reminder. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    reminders,
    isLoading,
    createReminder,
  };
}
