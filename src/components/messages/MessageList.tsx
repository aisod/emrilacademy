
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  read_at: string | null;
  created_at: string;
  sender: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
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
          id,
          content,
          sender_id,
          receiver_id,
          read_at,
          created_at,
          sender:profiles!sender_id(first_name, last_name, avatar_url)
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
    <ScrollArea className="h-[500px] w-full rounded-lg bg-gradient-to-b from-gray-50 to-white">
      <div className="space-y-4 p-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-200 hover:bg-gray-50/50 ${
              !message.read_at ? "bg-blue-50/30" : ""
            }`}
            onClick={() => !message.read_at && markAsRead(message.id)}
          >
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
                <h4 className="text-sm font-semibold text-gray-900">
                  {message.sender.first_name} {message.sender.last_name}
                </h4>
                <span className="text-xs text-gray-500">
                  {format(new Date(message.created_at), "MMM d, h:mm a")}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
