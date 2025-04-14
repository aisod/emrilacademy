
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourses, Course } from "@/hooks/use-courses";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export function CourseList() {
  const { courses, isLoading } = useCourses();

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course: Course) => (
        <Link key={course.id} to={`/courses/${course.slug}`}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{course.description}</p>
              <p className="text-sm mt-2">Duration: {course.duration_weeks} weeks</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
