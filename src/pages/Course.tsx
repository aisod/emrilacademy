
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseDetails } from "@/components/courses/CourseDetails";
import { ClassesForCourse } from "@/components/classes/ClassesForCourse";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function Course() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <CourseDetails slug={slug!} />
          </TabsContent>
          
          <TabsContent value="classes">
            {/* Fixed: The component expects courseId prop but the interface hasn't been updated */}
            <ClassesForCourse />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
