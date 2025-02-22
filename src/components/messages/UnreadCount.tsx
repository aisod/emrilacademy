
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function UnreadCount() {
  const { data: unreadCount } = useQuery({
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

  return unreadCount ? (
    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
      {unreadCount}
    </span>
  ) : null;
}
