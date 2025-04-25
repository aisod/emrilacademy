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
export function MessageComposer({
  receiverId,
  currentUserId
}: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSending(true);
    try {
      const {
        error
      } = await supabase.from("messages").insert({
        content: message.trim(),
        sender_id: currentUserId,
        receiver_id: receiverId
      });
      if (error) throw error;
      setMessage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again"
      });
    } finally {
      setIsSending(false);
    }
  };
  return <form onSubmit={handleSubmit} className={cn("p-4 border-t border-gray-200 bg-white shadow-sm", isMobile && "sticky bottom-0 left-0 right-0 z-10")}>
      <div className="flex gap-2 items-end">
        <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message..." className="min-h-[44px] max-h-32 resize-none p-3 bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" onKeyDown={e => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      }} />
        <Button type="submit" size="icon" disabled={!message.trim() || isSending} className="h-11 w-11 bg-blue-600 hover:bg-blue-700 shadow text-sky-500">
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>;
}