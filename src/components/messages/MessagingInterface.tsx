import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContactsList } from "./ContactsList";
import { ConversationView } from "./ConversationView";
import { useToast } from "@/hooks/use-toast";
import { MessageComposer } from "./MessageComposer";
import { MessagingHeader } from "./MessagingHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MessagingInterface() {
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("direct");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      return data;
    },
  });

  // Subscribe to new messages
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${currentUser.id}`,
        },
        (payload) => {
          // Invalidate messages query to refresh the list
          queryClient.invalidateQueries({ queryKey: ["messages"] });
          queryClient.invalidateQueries({ queryKey: ["unread-messages"] });

          // If this message is from the currently selected contact, mark it as read
          if (selectedContact && payload.new.sender_id === selectedContact.id) {
            markMessageAsRead(payload.new.id);
          } else {
            // Otherwise, show a notification
            toast({
              title: "New Message",
              description: "You have received a new message",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, selectedContact, queryClient, toast]);

  // Function to mark a message as read
  const markMessageAsRead = async (messageId: string) => {
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("id", messageId);
    
    // Refresh the unread count
    queryClient.invalidateQueries({ queryKey: ["unread-messages"] });
  };

  return (
    <div className="flex h-full border rounded-lg overflow-hidden bg-white">
      <div className="w-1/3 border-r flex flex-col">
        <Tabs 
          defaultValue="direct" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="p-3 border-b">
            <TabsList className="w-full">
              <TabsTrigger value="direct" className="flex-1">Direct Messages</TabsTrigger>
              <TabsTrigger value="class" className="flex-1">Class Messages</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="direct" className="flex-1 overflow-y-auto">
            <ContactsList 
              onSelectContact={setSelectedContact} 
              selectedContact={selectedContact}
              currentUserId={currentUser?.id}
            />
          </TabsContent>
          
          <TabsContent value="class" className="flex-1 overflow-y-auto">
            <div className="p-4 text-center text-gray-500">
              Class chats will appear here
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <MessagingHeader 
              contact={selectedContact} 
              type={activeTab}
            />
            
            <ConversationView 
              contact={selectedContact}
              currentUser={currentUser}
              markMessageAsRead={markMessageAsRead}
            />
            
            <MessageComposer 
              receiverId={selectedContact.id}
              currentUserId={currentUser?.id}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700">Select a contact to start messaging</h3>
              <p className="text-gray-500 mt-1">Choose a contact from the left sidebar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
