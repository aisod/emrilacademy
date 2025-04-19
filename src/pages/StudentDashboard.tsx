
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { ClassCalendar } from "@/components/calendar/ClassCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { StudentStats } from "@/components/dashboard/student/StudentStats";
import { WelcomeSection } from "@/components/dashboard/student/WelcomeSection";
import { DashboardError } from "@/components/dashboard/student/DashboardError";
import { useStudentProfile } from "@/hooks/use-student-profile";

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
      <div className="animate-fade-up space-y-6">
        <WelcomeSection
          firstName={profile?.first_name}
          isLoading={isLoadingProfile}
          onRefresh={refreshData}
          isRefreshing={isRefreshing}
        />

        {profileError && <DashboardError onRefresh={refreshData} />}

        <StudentStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NextClassCard />
          <RecentMessages />
        </div>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-white">
              Class Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <ClassCalendar role="student" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
