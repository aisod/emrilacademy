
import React from 'react';
import { NextClassCard } from "@/components/dashboard/NextClassCard";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { UpcomingAssignments } from "@/components/dashboard/student/UpcomingAssignments";
import { useNextClass } from "@/hooks/use-next-class";

export function DashboardGrid() {
  const { data: nextClass, isLoading: isLoadingNextClass } = useNextClass();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fade-up">
      <div className="md:col-span-2 lg:col-span-3 shadow-md hover:shadow-lg transition-shadow">
        <NextClassCard 
          title={nextClass?.title}
          startTime={nextClass?.start_time}
          endTime={nextClass?.end_time}
          isLoading={isLoadingNextClass}
        />
      </div>
      <div className="md:col-span-1 shadow-md hover:shadow-lg transition-shadow">
        <RecentMessages />
      </div>
      <div className="md:col-span-1 lg:col-span-2 shadow-md hover:shadow-lg transition-shadow">
        <UpcomingAssignments />
      </div>
    </div>
  );
}
