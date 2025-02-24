
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Video } from "lucide-react";

interface ClassStatusBadgeProps {
  classType: "live" | "recorded";
  startTime: string | null;
  endTime: string | null;
}

export function ClassStatusBadge({ classType, startTime, endTime }: ClassStatusBadgeProps) {
  const getClassStatus = (startTime: string | null, endTime: string | null) => {
    if (!startTime) return null;
    const now = new Date();
    const classStart = new Date(startTime);
    const classEnd = endTime ? new Date(endTime) : null;
    
    if (now < classStart) {
      return <Badge variant="outline">Upcoming</Badge>;
    } else if (classEnd && now > classEnd) {
      return <Badge variant="secondary">Completed</Badge>;
    } else {
      return <Badge variant="default">In Progress</Badge>;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {classType === "live" ? (
        <Badge variant="secondary" className="flex items-center gap-1">
          <PlayCircle className="w-3 h-3" />
          Live
        </Badge>
      ) : (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Video className="w-3 h-3" />
          Recorded
        </Badge>
      )}
      {getClassStatus(startTime, endTime)}
    </div>
  );
}
