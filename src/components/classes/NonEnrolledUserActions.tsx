import { Button } from "@/components/ui/button";
import { Video, CheckCircle, Loader } from "lucide-react";
import { useLiveSession } from "@/hooks/use-live-session";
import { useClassEnrollment } from "@/hooks/use-class-enrollment";
import type { Class } from "./types";
interface NonEnrolledUserActionsProps {
  class_: Class;
  isSessionActive: boolean;
}
export function NonEnrolledUserActions({
  class_,
  isSessionActive
}: NonEnrolledUserActionsProps) {
  const {
    handleJoinLiveClass
  } = useLiveSession();
  const {
    isEnrolling,
    enrollmentSuccess,
    handleEnroll
  } = useClassEnrollment(class_);
  const isClassFull = (class_.enrollments[0]?.count || 0) >= class_.capacity;
  return <>
      {class_.class_type === "live" && isSessionActive && <Button onClick={() => handleJoinLiveClass(class_.id)} className="w-full mb-2 group" variant="default">
          <Video className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          Join as Guest
        </Button>}
      <Button onClick={() => handleEnroll(class_.id)} variant={enrollmentSuccess ? "outline" : "default"} disabled={isClassFull || isEnrolling || enrollmentSuccess} className="w-full text-sky-500">
        {isEnrolling ? <>
            <Loader className="h-4 w-4 animate-spin mr-2" /> 
            Enrolling...
          </> : enrollmentSuccess ? <>
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            Enrolled Successfully
          </> : isClassFull ? "Class Full" : "Enroll Now"}
      </Button>
    </>;
}