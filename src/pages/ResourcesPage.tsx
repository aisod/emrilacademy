
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceBrowser } from "@/components/resources/ResourceBrowser";
import { ResourceUploadSection } from "@/components/resources/ResourceUploadSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("browse");
  
  const { data: userClasses, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["user-classes"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      
      // If teacher, get their classes
      if (profile?.role === "teacher") {
        const { data, error } = await supabase
          .from("classes")
          .select("id, title")
          .eq("teacher_id", session.user.id)
          .order("title");
          
        if (error) throw error;
        return { classes: data || [], isTeacher: true };
      }
      
      // If student, get enrolled classes
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          id,
          class_id,
          classes:class_id (
            id, 
            title
          )
        `)
        .eq("student_id", session.user.id);
        
      if (error) throw error;
      
      const classes = data?.map(enrollment => enrollment.classes) || [];
      return { classes, isTeacher: false };
    }
  });

  const handleResourceChange = () => {
    // This function can be expanded later if needed
  };

  if (isLoadingClasses) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-up space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-gray-500 mt-1">
            Browse and manage your class resources
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="browse">Browse Resources</TabsTrigger>
            {userClasses?.isTeacher && (
              <TabsTrigger value="upload">Upload Resource</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="browse" className="mt-6">
            <ResourceBrowser 
              classes={userClasses?.classes || []} 
              isTeacher={userClasses?.isTeacher || false}
              onResourceChange={handleResourceChange}
            />
          </TabsContent>
          
          {userClasses?.isTeacher && (
            <TabsContent value="upload" className="mt-6">
              <ResourceUploadSection 
                classes={userClasses.classes} 
                onSuccess={() => {
                  // After successful upload, switch to browse tab
                  setActiveTab("browse");
                  handleResourceChange();
                }}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
