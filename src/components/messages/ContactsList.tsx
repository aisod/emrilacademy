
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ContactsListProps {
  onSelectContact: (contact: any) => void;
  selectedContact: any;
  currentUserId: string;
  searchQuery: string;
}

// Define a proper type for our contact with optional message properties
interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: "student" | "teacher" | "admin";
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_time?: string;
}

export function ContactsList({ onSelectContact, selectedContact, currentUserId, searchQuery }: ContactsListProps) {
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts", currentUserId],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", currentUserId)
        .order("first_name");
      
      // If we have contacts, get the last message for each contact
      if (data && data.length > 0) {
        // Explicitly cast the data to Contact[] and add the message properties
        const contactsWithMessages: Contact[] = data.map(contact => ({
          ...contact,
          last_message: undefined,
          last_message_time: undefined
        }));
        
        return contactsWithMessages;
      }
      
      return (data || []) as Contact[];
    },
    enabled: !!currentUserId,
  });

  const filteredContacts = contacts?.filter(contact => 
    `${contact.first_name} ${contact.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!filteredContacts?.length) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        {searchQuery ? "No contacts found" : "No contacts available"}
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-[calc(100vh-280px)] md:h-[calc(100vh-320px)]">
      <div className="divide-y divide-gray-100">
        {filteredContacts?.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={cn(
              "w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors",
              "focus:outline-none focus:bg-gray-50",
              selectedContact?.id === contact.id && "bg-blue-50 hover:bg-blue-50"
            )}
          >
            <Avatar className="h-12 w-12 border border-gray-200 flex-shrink-0">
              {contact.avatar_url ? (
                <AvatarImage src={contact.avatar_url} alt={`${contact.first_name}'s avatar`} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {contact.first_name[0]}
                  {contact.last_name[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {contact.first_name} {contact.last_name}
                </p>
                {contact.last_message_time && (
                  <span className="text-xs text-gray-500">
                    {format(new Date(contact.last_message_time), "MMM d")}
                  </span>
                )}
              </div>
              {contact.last_message && (
                <p className="text-xs text-gray-600 truncate mt-1">
                  {contact.last_message}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
