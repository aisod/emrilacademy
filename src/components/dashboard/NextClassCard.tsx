
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock } from "lucide-react";

interface NextClassProps {
  title?: string;
  startTime?: string;
  endTime?: string;
  isLoading?: boolean;
}

export function NextClassCard({ title, startTime, endTime, isLoading }: NextClassProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Next Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!title || !startTime) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Next Class</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No upcoming classes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Class</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="space-y-2">
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(new Date(startTime), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              {format(new Date(startTime), "h:mm a")} -{" "}
              {endTime && format(new Date(endTime), "h:mm a")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
