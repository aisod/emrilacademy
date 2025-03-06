
import { User } from "lucide-react";
import { format } from "date-fns";
import { formatDuration } from "@/lib/format-utils";

interface ParticipantTableProps {
  participants: any[];
  calculateAttendanceTime: (join: string, leave: string | null) => number;
}

export function ParticipantTable({ 
  participants, 
  calculateAttendanceTime 
}: ParticipantTableProps) {
  return (
    <div className="max-h-64 overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Join Time</th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Leave Time</th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {participants && participants.length > 0 ? (
            participants.map((participant: any) => {
              const attendanceTime = calculateAttendanceTime(
                participant.join_time, 
                participant.leave_time
              );
              
              return (
                <tr key={participant.id}>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span>
                        {participant.profiles?.first_name} {participant.profiles?.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    {format(new Date(participant.join_time), "h:mm a")}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    {participant.leave_time 
                      ? format(new Date(participant.leave_time), "h:mm a") 
                      : "Still Active"}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    {formatDuration(attendanceTime)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="px-2 py-4 text-center text-sm text-gray-500">
                No participant data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
