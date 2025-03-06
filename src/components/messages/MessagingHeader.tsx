
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessagingHeaderProps {
  contact: any;
  type: string;
}

export function MessagingHeader({ contact, type }: MessagingHeaderProps) {
  return (
    <div className="p-3 border-b flex items-center justify-between">
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3">
          {contact.avatar_url ? (
            <AvatarImage src={contact.avatar_url} />
          ) : (
            <AvatarFallback>
              {contact.first_name?.[0]}
              {contact.last_name?.[0]}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <h3 className="font-medium">
            {type === "direct" 
              ? `${contact.first_name} ${contact.last_name}`
              : contact.title
            }
          </h3>
          <p className="text-xs text-gray-500">
            {type === "direct" 
              ? (contact.role === "teacher" ? "Teacher" : "Student")
              : `${contact.description || "Class chat"}`
            }
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon">
          <Video className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
