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
  onToggleResourceUpload
}: ClassCardActionsProps) {
  return <div className="mt-6 flex flex-wrap gap-3">
      {classType === "live" && (teacherView ? <Button onClick={onStartLiveSession} disabled={isSessionActive} className="flex-1 min-w-[140px] shadow-sm hover:shadow-md transition-all text-sky-500">
            <Play className="mr-2 h-4 w-4" />
            {isSessionActive ? "Class in Progress" : "Start Live Session"}
          </Button> : isSessionActive && <Button onClick={onJoinLiveSession} className="flex-1 min-w-[140px] shadow-sm hover:shadow-md transition-all">
              <Video className="mr-2 h-4 w-4" />
              Join Live Session
            </Button>)}
      <Button variant="outline" onClick={onToggleResources} className="flex-1 min-w-[140px] shadow-sm hover:shadow-md transition-all">
        <Book className="mr-2 h-4 w-4" />
        Resources
      </Button>
      {teacherView && <Button variant="outline" onClick={onToggleResourceUpload} className="flex-1 min-w-[140px] shadow-sm hover:shadow-md transition-all">
          Upload Resource
        </Button>}
    </div>;
}