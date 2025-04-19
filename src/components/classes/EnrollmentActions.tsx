
import type { Class } from "./types";
import { EnrolledUserActions } from "./EnrolledUserActions";
import { NonEnrolledUserActions } from "./NonEnrolledUserActions";

interface EnrollmentActionsProps {
  class_: Class;
  isSessionActive?: boolean;
}

export function EnrollmentActions({ class_, isSessionActive = false }: EnrollmentActionsProps) {
  return (
    <div className="space-y-2">
      {class_.isEnrolled ? (
        <EnrolledUserActions 
          class_={class_} 
          isSessionActive={isSessionActive} 
        />
      ) : (
        <NonEnrolledUserActions 
          class_={class_} 
          isSessionActive={isSessionActive} 
        />
      )}
    </div>
  );
}
