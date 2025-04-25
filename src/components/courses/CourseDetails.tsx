
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CourseForm } from "./CourseForm";
import { useCourses } from "@/hooks/use-courses";
import { Pencil } from "lucide-react";

interface CourseDetailsProps {
  slug: string;
}

export function CourseDetails({ slug }: CourseDetailsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { courses } = useCourses();
  
  const course = useMemo(() => {
    return courses.find(c => c.slug === slug);
  }, [courses, slug]);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-gray-500 mt-2">{course.description}</p>
        </div>
        
        <Button onClick={() => setShowEditDialog(true)} variant="outline">
          <Pencil className="h-4 w-4 mr-2" />
          Edit Course
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Course Details</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd>{course.duration_weeks} weeks</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="capitalize">{course.status}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">URL Slug</dt>
              <dd>{course.slug}</dd>
            </div>
          </dl>
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <CourseForm initialData={course} onSuccess={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
