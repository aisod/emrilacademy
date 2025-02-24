import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Clock, Users, Book } from "lucide-react";
import { ResourceUpload } from "@/components/resources/ResourceUpload";
import { ResourceList } from "@/components/resources/ResourceList";
import { Progress } from "@/components/ui/progress";

interface ClassCardProps {
  id: string;
  title: string;
  description: string | null;
  startTime: string | null;
  endTime: string | null;
  classType: "live" | "recorded";
  enrollmentCount?: number;
  capacity?: number;
  teacherView?: boolean;
}

export function ClassCard({
  id,
  title,
  description,
  startTime,
  endTime,
  classType,
  enrollmentCount = 0,
  capacity = 30,
  teacherView,
}: ClassCardProps) {
  const [showResources, setShowResources] = useState(false);
  const [showResourceUpload, setShowResourceUpload] = useState(false);

  const handleResourceSuccess = () => {
    setShowResourceUpload(false);
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold">{title}</h3>
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

        <div className="mt-6 flex gap-4">
          <Button
            variant="outline"
            onClick={() => setShowResources(!showResources)}
          >
            <Book className="mr-2 h-4 w-4" />
            Resources
          </Button>
          {teacherView && (
            <Button
              variant="outline"
              onClick={() => setShowResourceUpload(!showResourceUpload)}
            >
              Upload Resource
            </Button>
          )}
        </div>
      </div>

      {showResourceUpload && (
        <div className="border-t p-6 bg-gray-50">
          <h4 className="text-lg font-semibold mb-4">Upload New Resource</h4>
          <ResourceUpload classId={id} onSuccess={handleResourceSuccess} />
        </div>
      )}

      {showResources && (
        <div className="border-t p-6">
          <h4 className="text-lg font-semibold mb-4">Class Resources</h4>
          <ResourceList
            classId={id}
            isTeacher={teacherView}
            onDelete={() => setShowResources(true)}
          />
        </div>
      )}
    </Card>
  );
}
