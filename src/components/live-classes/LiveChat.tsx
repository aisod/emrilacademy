
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export function LiveChat({ classId }: { classId: string }) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages } = useQuery({
    queryKey: ["live-class-messages", classId],
    queryFn: async () => {
      const { data } = await supabase
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
        .eq("class_id", classId)
        .order("created_at", { ascending: true });
      return data as Message[];
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("messages")
        .insert({
          content,
          sender_id: session.user.id,
          class_id: classId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["live-class-messages", classId] });
      setMessage("");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel("live-class-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `class_id=eq.${classId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["live-class-messages", classId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [classId, queryClient]);

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="border-b">
        <CardTitle>Class Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages?.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                {message.sender.avatar_url ? (
                  <AvatarImage src={message.sender.avatar_url} />
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
                    {format(new Date(message.created_at), "HH:mm")}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (message.trim()) {
              sendMessage.mutate(message);
            }
          }}
          className="flex gap-2"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
