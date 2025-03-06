
import { Button } from "@/components/ui/button";
import { Book, Play, Video } from "lucide-react";

interface ClassCardActionsProps {
  classType: "live" | "recorded";
  teacherView?: boolean;
  isSessionActive: boolean;
  onStartLiveSession: () => void;
  onJoinLiveSession: () => void;
  onToggleResources: () => void;
  onToggleResourceUpload: () => void;
}

export function ClassCardActions({
  classType,
  teacherView,
  isSessionActive,
  onStartLiveSession,
  onJoinLiveSession,
  onToggleResources,
  onToggleResourceUpload,
}: ClassCardActionsProps) {
  return (
    <div className="mt-6 flex gap-4">
      {classType === "live" && (
        teacherView ? (
          <Button
            onClick={onStartLiveSession}
            disabled={isSessionActive}
          >
            <Play className="mr-2 h-4 w-4" />
            {isSessionActive ? "Class in Progress" : "Start Live Session"}
          </Button>
        ) : (
          isSessionActive && (
            <Button onClick={onJoinLiveSession}>
              <Video className="mr-2 h-4 w-4" />
              Join Live Session
            </Button>
          )
        )
      )}
      <Button
        variant="outline"
        onClick={onToggleResources}
      >
        <Book className="mr-2 h-4 w-4" />
        Resources
      </Button>
      {teacherView && (
        <Button
          variant="outline"
          onClick={onToggleResourceUpload}
        >
          Upload Resource
        </Button>
      )}
    </div>
  );
}
