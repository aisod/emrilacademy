
import { useState } from "react";
import { LiveClassRoom } from "@/components/live-classes/LiveClassRoom";
import { useClassDetails } from "@/hooks/use-class-details";

interface SingleClassViewProps {
  classId: string;
}

export function SingleClassView({ classId }: SingleClassViewProps) {
  const [isJoined, setIsJoined] = useState(false);
  const { data: classDetails } = useClassDetails(classId);

  return (
    <div className="h-[calc(100vh-4rem)]">
      <LiveClassRoom
        classId={classId}
        className={classDetails?.title}
        teacherName={`${classDetails?.teacher?.first_name} ${classDetails?.teacher?.last_name}`}
        isJoined={isJoined}
        onJoinStatusChange={setIsJoined}
      />
    </div>
  );
}
