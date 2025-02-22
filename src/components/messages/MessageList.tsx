
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  read_at: string | null;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

export function MessageList() {
  const { data: messages, refetch } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          profiles:sender_id(first_name, last_name)
        `)
        .or(`receiver_id.eq.${session.user.id},sender_id.eq.${session.user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const markAsRead = async (messageId: string) => {
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("id", messageId);
    
    refetch();
  };

  return (
    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              !message.read_at ? "bg-blue-50" : "bg-gray-50"
            }`}
            onClick={() => !message.read_at && markAsRead(message.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">
                  {message.profiles.first_name} {message.profiles.last_name}
                </p>
                <p className="text-gray-600">{message.content}</p>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(message.created_at), "MMM d, yyyy HH:mm")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
