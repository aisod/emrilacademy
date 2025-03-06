
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { MessageBubble } from "./MessageBubble";

interface ConversationViewProps {
  contact: any;
  currentUser: any;
  markMessageAsRead: (messageId: string) => Promise<void>;
}

export function ConversationView({ contact, currentUser, markMessageAsRead }: ConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages for this conversation
  const { data: messages } = useQuery({
    queryKey: ["messages", currentUser?.id, contact?.id],
    queryFn: async () => {
      if (!currentUser?.id || !contact?.id) return [];

      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${contact.id}),and(sender_id.eq.${contact.id},receiver_id.eq.${currentUser.id})`)
        .order("created_at", { ascending: true });

      // Mark unread messages as read
      const unreadMessages = data?.filter(
        msg => msg.sender_id === contact.id && !msg.read_at
      ) || [];

      if (unreadMessages.length > 0) {
        Promise.all(
          unreadMessages.map(msg => markMessageAsRead(msg.id))
        );
      }

      return data || [];
    },
    enabled: !!currentUser?.id && !!contact?.id,
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages?.reduce<Record<string, any[]>>((groups, message) => {
    const date = format(new Date(message.created_at), "MMMM d, yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {!messages?.length ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">No messages yet. Send a message to start the conversation.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedMessages && Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="flex justify-center my-4">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  {date}
                </span>
              </div>
              
              <div className="space-y-3">
                {dateMessages.map(message => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isCurrentUser={message.sender_id === currentUser?.id}
                  />
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
