
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ContactsListProps {
  onSelectContact: (contact: any) => void;
  selectedContact: any;
  currentUserId?: string;
}

export function ContactsList({ onSelectContact, selectedContact, currentUserId }: ContactsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch contacts with latest message
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];

      // First get all users we've interacted with (sent or received messages)
      const { data: sendersResponse } = await supabase
        .from("messages")
        .select("sender_id")
        .eq("receiver_id", currentUserId)
        .order("created_at", { ascending: false });

      const { data: receiversResponse } = await supabase
        .from("messages")
        .select("receiver_id")
        .eq("sender_id", currentUserId)
        .order("created_at", { ascending: false });

      // Combine and get unique user IDs
      const senderIds = sendersResponse?.map(msg => msg.sender_id) || [];
      const receiverIds = receiversResponse?.map(msg => msg.receiver_id) || [];
      const uniqueUserIds = [...new Set([...senderIds, ...receiverIds])];
      
      // Remove current user ID if it's in the list
      const filteredUserIds = uniqueUserIds.filter(id => id !== currentUserId);
      
      if (filteredUserIds.length === 0) return [];

      // Get user profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", filteredUserIds);

      // For each profile, get the latest message
      const contactsWithLatestMessage = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Get latest message between current user and this contact
          const { data: latestMessages } = await supabase
            .from("messages")
            .select("*")
            .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${currentUserId})`)
            .order("created_at", { ascending: false })
            .limit(1);

          const latestMessage = latestMessages?.[0];
          
          // Get unread count
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("sender_id", profile.id)
            .eq("receiver_id", currentUserId)
            .is("read_at", null);

          return {
            ...profile,
            latestMessage,
            unreadCount: count || 0
          };
        })
      );

      // Sort contacts by latest message date
      return contactsWithLatestMessage.sort((a, b) => {
        if (!a.latestMessage) return 1;
        if (!b.latestMessage) return -1;
        return new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime();
      });
    },
    enabled: !!currentUserId,
  });

  // Filter contacts based on search term
  const filteredContacts = contacts?.filter(contact => {
    if (!searchTerm) return true;
    const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <p className="text-gray-500">Loading contacts...</p>
          </div>
        ) : filteredContacts?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? "No contacts found" : "No conversations yet"}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredContacts?.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                  selectedContact?.id === contact.id
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onSelectContact(contact)}
              >
                <Avatar className="h-10 w-10 mr-3">
                  {contact.avatar_url ? (
                    <AvatarImage src={contact.avatar_url} />
                  ) : (
                    <AvatarFallback>
                      {contact.first_name[0]}
                      {contact.last_name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">
                      {contact.first_name} {contact.last_name}
                    </p>
                    {contact.latestMessage && (
                      <span className="text-xs text-gray-500">
                        {format(new Date(contact.latestMessage.created_at), "MMM d")}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 truncate">
                      {contact.latestMessage ? contact.latestMessage.content : "No messages yet"}
                    </p>
                    {contact.unreadCount > 0 && (
                      <span className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
