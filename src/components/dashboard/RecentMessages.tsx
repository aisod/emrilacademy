
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentMessages() {
  const { data: messages, isLoading } = useQuery({
    queryKey: ["recent-messages"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          created_at,
          sender:profiles!sender_id(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq("receiver_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))
        ) : messages?.length === 0 ? (
          <p className="text-gray-500">No recent messages</p>
        ) : (
          messages?.map((message) => (
            <div key={message.id} className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                {message.sender.avatar_url ? (
                  <AvatarImage src={message.sender.avatar_url} alt={`${message.sender.first_name}'s avatar`} />
                ) : (
                  <AvatarFallback>
                    {message.sender.first_name[0]}
                    {message.sender.last_name[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {message.sender.first_name} {message.sender.last_name}
                  </p>
                  <span className="text-xs text-gray-500">
                    {format(new Date(message.created_at), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
