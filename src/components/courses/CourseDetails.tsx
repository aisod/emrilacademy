
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CourseForm } from "./CourseForm";
import { useCourses } from "@/hooks/use-courses";
import { Pencil, Book, Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface CourseDetailsProps {
  slug: string;
}

export function CourseDetails({ slug }: CourseDetailsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { courses, isLoading } = useCourses();
  const { toast } = useToast();
  
  const course = useMemo(() => {
    return courses.find(c => c.slug === slug);
  }, [courses, slug]);

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    toast({
      title: "Course updated",
      description: "Your course has been successfully updated.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <h3 className="text-xl font-medium mb-2">Course not found</h3>
          <p className="text-muted-foreground">The requested course could not be found or may have been removed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <Badge variant={course.status === "published" ? "default" : "secondary"}>
              {course.status === "published" ? "Published" : "Draft"}
            </Badge>
          </div>
          <p className="text-gray-500 mt-2">{course.description}</p>
        </div>
        
        <Button onClick={() => setShowEditDialog(true)} variant="outline">
          <Pencil className="h-4 w-4 mr-2" />
          Edit Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <dt className="font-medium text-muted-foreground">Duration</dt>
                <dd>{course.duration_weeks} {course.duration_weeks === 1 ? 'week' : 'weeks'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <dt className="font-medium text-muted-foreground">Created</dt>
                <dd>{new Date(course.created_at).toLocaleDateString()}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Book className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <dt className="font-medium text-muted-foreground">URL</dt>
                <dd className="break-all">/courses/{course.slug}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <dt className="font-medium text-muted-foreground">Instructor</dt>
                <dd className="truncate">{course.teacher_id}</dd>
              </div>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <CourseForm initialData={course} onSuccess={handleEditSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
