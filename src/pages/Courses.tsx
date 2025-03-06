
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentClassesView } from "@/components/classes/StudentClassesView";
import { TeacherClassesView } from "@/components/classes/TeacherClassesView";
import { useUserRole } from "@/hooks/use-user-role";
import { Loader2 } from "lucide-react";

export default function Courses() {
  const { data: userRole, isLoading } = useUserRole();
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Classes</h1>
          <p className="text-gray-500 mt-1">
            {isTeacher
              ? "Manage your classes and view student enrollments"
              : "View your enrolled classes and upcoming sessions"}
          </p>
        </div>

        {isTeacher ? (
          <TeacherClassesView />
        ) : (
          <Tabs
            defaultValue="enrolled"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="enrolled">Enrolled Classes</TabsTrigger>
              <TabsTrigger value="completed">Completed Classes</TabsTrigger>
              <TabsTrigger value="saved">Saved Classes</TabsTrigger>
            </TabsList>

            <TabsContent value="enrolled" className="pt-2">
              <StudentClassesView type="enrolled" />
            </TabsContent>

            <TabsContent value="completed" className="pt-2">
              <StudentClassesView type="completed" />
            </TabsContent>

            <TabsContent value="saved" className="pt-2">
              <StudentClassesView type="saved" />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}
