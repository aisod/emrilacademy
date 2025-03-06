
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, Users } from "lucide-react";
import { formatDuration } from "@/lib/format-utils";

interface SessionDetailsProps {
  sessionDetails: any;
  teacherName: string;
  totalDuration: number;
}

export function SessionDetails({ 
  sessionDetails, 
  teacherName, 
  totalDuration 
}: SessionDetailsProps) {
  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{sessionDetails.classes?.title || "Class Session"}</h3>
          <p className="text-sm text-gray-500">Taught by {teacherName}</p>
        </div>
        <Badge variant={sessionDetails.status === "ended" ? "secondary" : "default"}>
          {sessionDetails.status.charAt(0).toUpperCase() + sessionDetails.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
          <Calendar className="h-5 w-5 text-gray-500 mb-1" />
          <span className="text-sm text-gray-500">Date</span>
          <span className="font-medium">
            {sessionDetails.started_at ? format(new Date(sessionDetails.started_at), "MMM d, yyyy") : "N/A"}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
          <Clock className="h-5 w-5 text-gray-500 mb-1" />
          <span className="text-sm text-gray-500">Duration</span>
          <span className="font-medium">{formatDuration(totalDuration)}</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
          <Users className="h-5 w-5 text-gray-500 mb-1" />
          <span className="text-sm text-gray-500">Participants</span>
          <span className="font-medium">{sessionDetails.participant_count || 0}</span>
        </div>
      </div>
    </>
  );
}
