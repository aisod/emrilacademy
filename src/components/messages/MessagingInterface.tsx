import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContactsList } from "./ContactsList";
import { ConversationView } from "./ConversationView";
import { useToast } from "@/hooks/use-toast";
import { MessageComposer } from "./MessageComposer";
import { MessagingHeader } from "./MessagingHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MessagingInterface() {
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("direct");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    <div className="flex h-full border rounded-lg overflow-hidden bg-white shadow">
      {/* Contact list section - hidden on mobile when a chat is selected */}
      <div className={cn(
        "border-r border-gray-100 flex flex-col bg-white",
        isMobile && selectedContact ? "hidden" : "w-full md:w-80"
      )}>
        <div className="p-4 border-b border-gray-100 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
          <Tabs 
            defaultValue="direct" 
            className="w-full"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="direct" className="text-sm">Direct</TabsTrigger>
              <TabsTrigger value="class" className="text-sm">Classes</TabsTrigger>
            </TabsList>
          
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-50"
              />
            </div>
          
            <div className="mt-4">
              <TabsContent value="direct" className="m-0 p-0">
                <ContactsList 
                  onSelectContact={setSelectedContact} 
                  selectedContact={selectedContact}
                  currentUserId={currentUser?.id}
                  searchQuery={searchQuery}
                />
              </TabsContent>
              
              <TabsContent value="class" className="m-0 p-0">
                <div className="flex items-center justify-center h-[300px] text-gray-500 p-4 text-center bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium mb-1">Class Messages Coming Soon</p>
                    <p className="text-xs text-gray-400">You'll be able to chat with your classes here</p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* Chat section - full width on mobile when selected */}
      <div className={cn(
        "flex-1 flex flex-col bg-gray-50",
        isMobile && !selectedContact ? "hidden" : "flex"
      )}>
        {selectedContact ? (
          <>
            <div className="flex items-center gap-2 p-4 border-b bg-white shadow-sm">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedContact(null)}
                  className="md:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex-1">
                <MessagingHeader 
                  contact={selectedContact} 
                  type={activeTab}
                />
              </div>
            </div>
            
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
          <div className="flex-1 flex items-center justify-center p-4 hidden md:flex">
            <div className="text-center max-w-sm">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Contact</h3>
              <p className="text-sm text-gray-500">Choose someone from your contacts list to start a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
