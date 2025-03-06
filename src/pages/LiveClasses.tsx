
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { LiveClassesContent } from "@/components/live-classes/LiveClassesContent";
import { SingleClassView } from "@/components/live-classes/SingleClassView";
import { useEffect, useState } from "react";
import { useClassDetails } from "@/hooks/use-class-details";
import { SessionLoadingState } from "@/components/live-classes/SessionLoadingState";
import { NoActiveSessionAlert } from "@/components/live-classes/NoActiveSessionAlert";
import { useToast } from "@/components/ui/use-toast";

export default function LiveClasses() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: classDetails, isLoading: classLoading, error } = useClassDetails(classId);

  useEffect(() => {
    // Set loading to false after data is fetched
    if (!classLoading) {
      setIsLoading(false);
    }

    // Handle error cases
    if (error) {
      toast({
        title: "Error loading class",
        description: "Could not load the class details. Please try again.",
        variant: "destructive",
      });
    }
  }, [classLoading, error, toast]);

  // If we're loading a specific class view
  if (classId) {
    if (isLoading || classLoading) {
      return (
        <DashboardLayout>
          <SessionLoadingState />
        </DashboardLayout>
      );
    }

    if (error || !classDetails) {
      return (
        <DashboardLayout>
          <NoActiveSessionAlert 
            redirectPath="/live-classes"
            redirectLabel="Back to Live Classes"
          />
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout>
        <SingleClassView classId={classId} />
      </DashboardLayout>
    );
  }

  // If no classId is provided, show the list of all live classes
  return (
    <DashboardLayout>
      <LiveClassesContent />
    </DashboardLayout>
  );
}
