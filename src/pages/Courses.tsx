
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CourseList } from "@/components/courses/CourseList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CourseForm } from "@/components/courses/CourseForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassesForCourse } from "@/components/classes/ClassesForCourse";
import { useUserRole } from "@/hooks/use-user-role";

export default function Courses() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("courses");
  const { data: userRole } = useUserRole();

  const isTeacher = userRole === "teacher";

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Courses & Classes</h1>
            <p className="text-gray-500 mt-1">
              {isTeacher 
                ? "Manage your courses and create new classes" 
                : "Browse available courses and classes"}
            </p>
          </div>
          {isTeacher && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="classes">All Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <CourseList />
          </TabsContent>

          <TabsContent value="classes">
            <ClassesForCourse />
          </TabsContent>
        </Tabs>

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
