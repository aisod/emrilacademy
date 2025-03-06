
import { Progress } from "@/components/ui/progress";
import { formatDuration } from "@/lib/format-utils";
import { format } from "date-fns";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";

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
  // Generate sample attendance data based on session duration
  const generateAttendanceData = () => {
    if (!sessionDetails.started_at || !sessionDetails.ended_at) {
      return [];
    }
    
    const startTime = new Date(sessionDetails.started_at);
    const endTime = new Date(sessionDetails.ended_at);
    const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    
    // Create data points every 5 minutes
    const dataPoints = Math.max(5, Math.ceil(durationMinutes / 5));
    const data = [];
    
    let currentParticipants = 0;
    const maxParticipants = participantCount || 0;
    
    for (let i = 0; i < dataPoints; i++) {
      const timeOffset = (i * 5) % 60;
      const hourOffset = Math.floor((i * 5) / 60);
      
      const pointTime = new Date(startTime);
      pointTime.setHours(pointTime.getHours() + hourOffset);
      pointTime.setMinutes(pointTime.getMinutes() + timeOffset);
      
      // Simulate attendance pattern: gradual increase, plateau, slight decrease
      if (i < dataPoints / 3) {
        currentParticipants = Math.min(maxParticipants, Math.floor((i / (dataPoints / 3)) * maxParticipants));
      } else if (i > (dataPoints * 2) / 3) {
        currentParticipants = Math.max(Math.floor(maxParticipants * 0.8), 
          Math.floor(maxParticipants - ((i - (dataPoints * 2) / 3) / (dataPoints / 3)) * (maxParticipants * 0.2)));
      } else {
        currentParticipants = maxParticipants;
      }
      
      data.push({
        time: format(pointTime, "h:mm a"),
        participants: currentParticipants
      });
    }
    
    return data;
  };
  
  const attendanceData = generateAttendanceData();

  return (
    <div className="space-y-6">
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
      
      {attendanceData.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-3">Attendance Over Time</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={attendanceData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10 }} 
                  tickFormatter={(value) => value.split(' ')[0]} 
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  domain={[0, Math.max(participantCount || 1, 1)]}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="participants"
                  name="Participants"
                  stroke="#6366f1"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
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
