import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MessageComposerProps {
  receiverId: string;
  currentUserId: string;
}

export function MessageComposer({ receiverId, currentUserId }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          content: message.trim(),
          sender_id: currentUserId,
          receiver_id: receiverId,
        });

      if (error) throw error;
      setMessage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "p-4 border-t bg-white shadow-sm",
        isMobile && "sticky bottom-0"
      )}
    >
      <div className="flex gap-2 items-end">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[44px] max-h-32 resize-none p-3 bg-gray-50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!message.trim() || isSending}
          className={cn(
            "h-11 w-11",
            isMobile && "h-11 w-11"
          )}
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
