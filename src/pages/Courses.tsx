import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentClassesView } from "@/components/classes/StudentClassesView";
import { TeacherClassesView } from "@/components/classes/TeacherClassesView";
import { useUserRole } from "@/hooks/use-user-role";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CourseList } from "@/components/courses/CourseList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CourseForm } from "@/components/courses/CourseForm";

export default function Courses() {
  const { data: userRole, isLoading } = useUserRole();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("enrolled");

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const isTeacher = userRole === "teacher";

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Courses</h1>
            <p className="text-gray-500 mt-1">
              {userRole === "teacher" 
                ? "Manage your courses and create new ones" 
                : "Browse available courses"}
            </p>
          </div>
          {userRole === "teacher" && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          )}
        </div>

        <CourseList />

        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <CourseForm />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
