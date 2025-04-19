
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StudentStats } from "@/components/dashboard/student/StudentStats";
import { WelcomeSection } from "@/components/dashboard/student/WelcomeSection";
import { DashboardError } from "@/components/dashboard/student/DashboardError";
import { DashboardCalendar } from "@/components/dashboard/student/DashboardCalendar";
import { DashboardGrid } from "@/components/dashboard/student/DashboardGrid";
import { useStudentProfile } from "@/hooks/use-student-profile";
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export default function StudentDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { 
    data: profile, 
    isLoading: isLoadingProfile, 
    error: profileError 
  } = useStudentProfile();

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-profile"] }),
        queryClient.invalidateQueries({ queryKey: ["student-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["next-class"] }),
      ]);
      toast({
        title: "Dashboard refreshed",
        description: "Your dashboard data has been updated.",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "Unable to refresh your dashboard data. Please try again later.",
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [queryClient, toast]);

  return (
    <DashboardLayout requiredRole="student">
      <div className="animate-fade-up space-y-4 md:space-y-6">
        <WelcomeSection
          firstName={profile?.first_name}
          isLoading={isLoadingProfile}
          onRefresh={refreshData}
          isRefreshing={isRefreshing}
        />

        {profileError && <DashboardError onRefresh={refreshData} />}

        <StudentStats />

        <DashboardGrid />

        <DashboardCalendar />
      </div>
    </DashboardLayout>
  );
}
