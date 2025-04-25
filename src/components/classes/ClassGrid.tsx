
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassCard } from "./ClassCard";

interface ClassGridProps {
  classes: any[];
  isLoading: boolean;
  teacherView?: boolean;
}

export function ClassGrid({ classes = [], isLoading, teacherView = false }: ClassGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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

  if (!Array.isArray(classes) || classes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">
            {teacherView 
              ? "You haven't created any classes yet. Click 'Create Class' to get started." 
              : "No classes available. Browse classes to find something to enroll in."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {classes.map((class_) => (
        <ClassCard
          key={class_.id}
          id={class_.id}
          title={class_.title}
          description={class_.description}
          startTime={class_.start_time}
          endTime={class_.end_time}
          classType={class_.class_type}
          enrollmentCount={class_.enrollments[0]?.count || 0}
          capacity={class_.capacity}
          teacherView={teacherView}
        />
      ))}
    </div>
  );
}
