
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseSubscription } from "@/hooks/use-supabase-subscription";

export function UnreadCount() {
  const { data: unreadCount, refetch } = useQuery({
    queryKey: ["unread-messages"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return 0;

      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", session.user.id)
        .is("read_at", null);

      if (error) throw error;
      return count || 0;
    },
  });

  // Subscribe to new messages to update the count in real-time
  useSupabaseSubscription(
    "messages",
    () => {
      refetch();
    }
  );

  return unreadCount && unreadCount > 0 ? (
    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  ) : null;
}
