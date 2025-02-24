
import { format } from "date-fns";
import { Calendar, Clock, Users, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Class } from "./types";

interface ClassDetailsProps {
  class_: Class;
}

export function ClassDetails({ class_ }: ClassDetailsProps) {
  return (
    <div className="space-y-2">
      {class_.start_time && (
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{format(new Date(class_.start_time), "MMMM d, yyyy")}</span>
        </div>
      )}
      {class_.start_time && class_.end_time && (
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {format(new Date(class_.start_time), "h:mm a")} -{" "}
            {format(new Date(class_.end_time), "h:mm a")}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-500">
          <Users className="w-4 h-4 mr-2" />
          <span>{class_.enrollments[0]?.count || 0} students enrolled</span>
        </div>
        <div className="flex items-center text-gray-500">
          <BookOpen className="w-4 h-4 mr-2" />
          <span>Resources available</span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Class capacity</span>
          <span>{class_.enrollments[0]?.count || 0}/{class_.capacity}</span>
        </div>
        <Progress 
          value={((class_.enrollments[0]?.count || 0) / class_.capacity) * 100} 
          className="h-2"
        />
      </div>
    </div>
  );
}
