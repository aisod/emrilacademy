
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface SessionHistoryItem {
  id: string;
  class_id: string;
  started_at: string | null;
  ended_at: string | null;
  participant_count: number;
  duration_seconds: number;
  class: {
    title: string;
    teacher: {
      first_name: string;
      last_name: string;
    };
  };
}

interface SessionHistoryListProps {
  sessionHistory: SessionHistoryItem[] | undefined;
}

export function SessionHistoryList({ sessionHistory }: SessionHistoryListProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!sessionHistory || sessionHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Session History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have any past class sessions. When you participate in a class, it will be shown here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessionHistory.map((session) => (
        <Card key={session.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle>{session.class.title}</CardTitle>
            <p className="text-sm text-gray-500">
              by {session.class.teacher.first_name} {session.class.teacher.last_name}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                <span>Completed</span>
              </div>
              {session.started_at && session.ended_at && (
                <p className="text-sm text-gray-600">
                  {format(new Date(session.started_at), "MMM d, yyyy · h:mm a")}
                </p>
              )}
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <div>
                  <span className="font-medium">Duration:</span> {formatDuration(session.duration_seconds || 0)}
                </div>
                <div>
                  <span className="font-medium">Participants:</span> {session.participant_count || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
