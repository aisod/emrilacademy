
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassStatusBadge } from "./ClassStatusBadge";
import { ClassDetails } from "./ClassDetails";
import { EnrollmentActions } from "./EnrollmentActions";
import type { ClassListProps } from "./types";

export function ClassList({ classes, isLoading }: ClassListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!classes.length) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">No classes available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((class_) => (
        <Card key={class_.id} className="overflow-hidden">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle>{class_.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  by {class_.teacher.first_name} {class_.teacher.last_name}
                </p>
              </div>
              <ClassStatusBadge
                classType={class_.class_type}
                startTime={class_.start_time}
                endTime={class_.end_time}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {class_.description && (
              <p className="text-gray-600 text-sm">{class_.description}</p>
            )}
            <ClassDetails class_={class_} />
            <EnrollmentActions class_={class_} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
