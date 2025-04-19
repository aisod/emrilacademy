
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

export function ContactsList({ onSelectContact, selectedContact, currentUserId, searchQuery }: ContactsListProps) {
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts", currentUserId],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", currentUserId)
        .order("first_name");
      return data || [];
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
    <div className="overflow-y-auto h-full">
      <div className="divide-y divide-gray-100">
        {filteredContacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={cn(
              "w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors",
              "focus:outline-none focus:bg-gray-50",
              selectedContact?.id === contact.id && "bg-blue-50 hover:bg-blue-50"
            )}
          >
            <Avatar className="h-10 w-10 border border-gray-200">
              {contact.avatar_url ? (
                <AvatarImage src={contact.avatar_url} alt={`${contact.first_name}'s avatar`} />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {contact.first_name[0]}
                  {contact.last_name[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {contact.first_name} {contact.last_name}
                </p>
                {contact.last_message_time && (
                  <span className="text-xs text-gray-500">
                    {format(new Date(contact.last_message_time), "MMM d")}
                  </span>
                )}
              </div>
              {contact.last_message && (
                <p className="text-xs text-gray-500 truncate mt-0.5">
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
