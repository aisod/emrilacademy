
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface MessageComposerProps {
  receiverId: string;
  currentUserId?: string;
  classId?: string;
}

export function MessageComposer({ receiverId, currentUserId, classId }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!currentUserId) throw new Error("Not authenticated");

      const messageData = {
        content,
        sender_id: currentUserId,
        receiver_id: receiverId,
        ...(classId ? { class_id: classId } : {})
      };

      const { data, error } = await supabase
        .from("messages")
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error.message,
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage.mutate(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-3 border-t">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={sendMessage.isPending}
          />
        </div>
        
        <Button
          size="icon"
          variant="outline"
          type="button"
          className="h-10 w-10"
          disabled={sendMessage.isPending}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <Button
          size="icon"
          type="button"
          className="h-10 w-10"
          onClick={handleSendMessage}
          disabled={!message.trim() || sendMessage.isPending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
