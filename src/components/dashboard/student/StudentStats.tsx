
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book, MessageSquare, FileText } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

export function StudentStats() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["student-stats"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      try {
        const [enrollmentsResponse, messagesResponse] = await Promise.all([
          supabase
            .from("enrollments")
            .select("class_id", { count: "exact" })
            .eq("student_id", session.user.id),
          supabase
            .from("messages")
            .select("id", { count: "exact" })
            .eq("receiver_id", session.user.id)
            .is("read_at", null),
        ]);
  
        if (enrollmentsResponse.error) throw enrollmentsResponse.error;
        if (messagesResponse.error) throw messagesResponse.error;
  
        return {
          upcomingClasses: enrollmentsResponse.count || 0,
          unreadMessages: messagesResponse.count || 0,
          resourcesCount: 0,
        };
      } catch (error) {
        console.error("Error fetching student stats:", error);
        throw error;
      }
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      <StatsCard
        title="Upcoming Classes"
        value={stats?.upcomingClasses}
        icon={Book}
        isLoading={isLoadingStats}
      />
      <StatsCard
        title="Unread Messages"
        value={stats?.unreadMessages}
        icon={MessageSquare}
        isLoading={isLoadingStats}
      />
      <StatsCard
        title="Resources"
        value={stats?.resourcesCount}
        icon={FileText}
        isLoading={isLoadingStats}
      />
    </div>
  );
}
