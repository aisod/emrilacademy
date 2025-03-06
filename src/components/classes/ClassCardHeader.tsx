
import { format } from "date-fns";
import { Calendar, Clock, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ClassStatusBadge } from "./ClassStatusBadge";

interface ClassCardHeaderProps {
  title: string;
  description: string | null;
  startTime: string | null;
  endTime: string | null;
  classType: "live" | "recorded";
  enrollmentCount: number;
  capacity: number;
  isActive?: boolean;
  timeUntilClass: string | null;
}

export function ClassCardHeader({
  title,
  description,
  startTime,
  endTime,
  classType,
  enrollmentCount,
  capacity,
  isActive,
  timeUntilClass,
}: ClassCardHeaderProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          {classType === "live" && (
            <ClassStatusBadge 
              classType={classType} 
              isActive={isActive} 
              timeUntilClass={timeUntilClass} 
            />
          )}
        </div>
      </div>

      {description && (
        <p className="mt-2 text-gray-600">{description}</p>
      )}

      <div className="mt-4 space-y-2">
        {startTime && (
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(new Date(startTime), "MMMM d, yyyy")}</span>
          </div>
        )}
        {startTime && endTime && (
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              {format(new Date(startTime), "h:mm a")} -{" "}
              {format(new Date(endTime), "h:mm a")}
            </span>
          </div>
        )}
        <div className="flex items-center text-gray-500">
          <Users className="w-4 h-4 mr-2" />
          <span>{enrollmentCount} / {capacity} students enrolled</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Class capacity</span>
            <span>{enrollmentCount}/{capacity}</span>
          </div>
          <Progress 
            value={(enrollmentCount / capacity) * 100} 
            className="h-2"
          />
        </div>
      </div>
    </div>
  );
}
