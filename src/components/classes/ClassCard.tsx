
import { format } from "date-fns";
import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClassCardProps {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  classType: "live" | "recorded";
  isEnrolled?: boolean;
  onEnroll?: () => void;
  teacherView?: boolean;
}

export function ClassCard({
  title,
  description,
  startTime,
  endTime,
  classType,
  isEnrolled,
  onEnroll,
  teacherView,
}: ClassCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
          {classType}
        </span>
      </div>
      
      <p className="text-gray-600">{description}</p>
      
      <div className="space-y-2">
        <div className="flex items-center text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{format(new Date(startTime), "MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {format(new Date(startTime), "h:mm a")} -{" "}
            {format(new Date(endTime), "h:mm a")}
          </span>
        </div>
      </div>

      {!teacherView && (
        <Button
          onClick={onEnroll}
          disabled={isEnrolled}
          variant={isEnrolled ? "secondary" : "default"}
          className="w-full mt-4"
        >
          {isEnrolled ? "Enrolled" : "Enroll Now"}
        </Button>
      )}
    </div>
  );
}
