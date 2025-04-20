
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface NextClassCardProps {
  title?: string;
  startTime?: string;
  endTime?: string;
  isLoading?: boolean;
}

export function NextClassCard({ title, startTime, endTime, isLoading }: NextClassCardProps) {
  if (isLoading) {
    return (
      <Card className="border border-card-border shadow-sm bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-gray-900 dark:text-white">Next Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
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
      <Card className="border border-card-border shadow-sm bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-gray-900 dark:text-white">Next Class</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-gray-500 dark:text-gray-400">No upcoming classes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-card-border shadow-sm bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-gray-900 dark:text-white">Next Class</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="space-y-2">
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-primary dark:text-primary-light" />
            <span>{format(new Date(startTime), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-2 text-primary dark:text-primary-light" />
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
