import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { formatDuration } from "@/lib/format-utils";
interface SessionControlBarProps {
  participantCount: number;
  sessionDuration: number;
  showAnalytics: boolean;
  onToggleAnalytics: () => void;
  onEndSession: () => void;
}
export function SessionControlBar({
  participantCount,
  sessionDuration,
  showAnalytics,
  onToggleAnalytics,
  onEndSession
}: SessionControlBarProps) {
  return <div className="flex space-x-2">
      <Button variant="outline" onClick={onToggleAnalytics} className="bg-black/70 hover:bg-black/80 border-gray-600 text-sky-500">
        <Users className="mr-2 h-4 w-4" />
        {participantCount} participant{participantCount !== 1 ? 's' : ''}
      </Button>
      
      <Button variant="outline" className="bg-black/70 hover:bg-black/80 border-gray-600 text-sky-500">
        <Clock className="mr-2 h-4 w-4" />
        {formatDuration(sessionDuration)}
      </Button>
      
      <Button variant="destructive" onClick={onEndSession} className="bg-red-600 hover:bg-red-700 text-sky-500">
        End Class Session
      </Button>
    </div>;
}