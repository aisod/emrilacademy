
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

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
  onEndSession,
}: SessionControlBarProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        className="bg-black/70 text-white hover:bg-black/80 border-gray-600"
        onClick={onToggleAnalytics}
      >
        <Users className="mr-2 h-4 w-4" />
        {participantCount} participant{participantCount !== 1 ? 's' : ''}
      </Button>
      
      <Button 
        variant="outline"
        className="bg-black/70 text-white hover:bg-black/80 border-gray-600"
      >
        <Clock className="mr-2 h-4 w-4" />
        {formatDuration(sessionDuration)}
      </Button>
      
      <Button 
        variant="destructive"
        onClick={onEndSession}
        className="bg-red-600 hover:bg-red-700"
      >
        End Class Session
      </Button>
    </div>
  );
}
