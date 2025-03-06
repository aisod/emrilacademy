
import { Progress } from "@/components/ui/progress";
import { formatDuration } from "@/lib/format-utils";
import { format } from "date-fns";

interface SessionOverviewProps {
  averageAttendance: number;
  attendanceRate: number;
  participantCount: number;
  sessionDetails: any;
}

export function SessionOverview({
  averageAttendance,
  attendanceRate,
  participantCount,
  sessionDetails
}: SessionOverviewProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm">Average Attendance Time</span>
          <span className="text-sm font-medium">{formatDuration(Math.round(averageAttendance))}</span>
        </div>
        <Progress value={attendanceRate} className="h-2" />
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm">Peak Participants</span>
          <span className="text-sm font-medium">{participantCount || 0}</span>
        </div>
        <Progress 
          value={((participantCount || 0) / 30) * 100} 
          className="h-2" 
        />
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Session Timeline</h4>
        <div className="text-xs space-y-1">
          <div className="flex justify-between py-1 border-t">
            <span>Started</span>
            <span>
              {sessionDetails.started_at
                ? format(new Date(sessionDetails.started_at), "h:mm a")
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between py-1 border-t">
            <span>Ended</span>
            <span>
              {sessionDetails.ended_at
                ? format(new Date(sessionDetails.ended_at), "h:mm a")
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
