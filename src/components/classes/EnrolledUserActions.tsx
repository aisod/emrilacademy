
import { Button } from "@/components/ui/button";
import { Video, CheckCircle } from "lucide-react";
import { useLiveSession } from "@/hooks/use-live-session";
import type { Class } from "./types";

interface EnrolledUserActionsProps {
  class_: Class;
  isSessionActive: boolean;
}

export function EnrolledUserActions({ class_, isSessionActive }: EnrolledUserActionsProps) {
  const { handleJoinLiveClass } = useLiveSession();

  return (
    <>
      {class_.class_type === "live" && isSessionActive && (
        <Button 
          onClick={() => handleJoinLiveClass(class_.id)}
          className="w-full group"
          variant="default"
        >
          <Video className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          Join Live Class
        </Button>
      )}
      <Button variant="secondary" className="w-full flex items-center justify-center gap-2" disabled>
        <CheckCircle className="h-4 w-4" />
        Already Enrolled
      </Button>
    </>
  );
}
