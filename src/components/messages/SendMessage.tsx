
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SendMessage() {
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const { toast } = useToast();

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name");
      if (error) throw error;
      return data;
    },
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      const { error } = await supabase.from("messages").insert({
        content: message,
        receiver_id: receiverId,
        sender_id: session.user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent successfully",
      });

      setMessage("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <Select value={receiverId} onValueChange={setReceiverId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select recipient" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-50/50 border-gray-200 focus:border-blue-300 rounded-full px-4"
          required
        />
        <Button 
          type="submit"
          size="icon"
          className="rounded-full w-10 h-10 bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
