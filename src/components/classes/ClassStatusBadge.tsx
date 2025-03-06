
import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";

interface ClassStatusBadgeProps {
  classType: "live" | "recorded";
  isActive?: boolean;
  timeUntilClass: string | null;
}

export function ClassStatusBadge({ 
  classType, 
  isActive, 
  timeUntilClass 
}: ClassStatusBadgeProps) {
  if (classType === "live") {
    if (isActive) {
      return <Badge variant="default">In Progress</Badge>;
    }
    
    if (timeUntilClass) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline">Upcoming</Badge>
          <span className="text-sm text-gray-500">
            Starts in {timeUntilClass}
          </span>
        </div>
      );
    }
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <Video className="w-3 h-3" />
      {classType === "live" ? "Live" : "Recorded"}
    </Badge>
  );
}
